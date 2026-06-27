<?php

declare(strict_types=1);

namespace App\Repository;

use PDO;

final class UserRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function syncUserFromAuth(string $clerkUserId, array $profile, array $meta): array
    {
        $gmail = $this->firstNonEmpty($profile['gmail'] ?? null, $profile['email'] ?? null);
        $phone = $this->firstNonEmpty($profile['phone_number'] ?? null);
        $address = $this->firstNonEmpty($profile['address'] ?? null);
        $name = $this->firstNonEmpty($profile['user_name'] ?? null, $profile['name'] ?? null);
        $image = $this->firstNonEmpty($profile['profile_image_url'] ?? null);

        try {
            $this->pdo->beginTransaction();

            $statement = $this->pdo->prepare(
                'INSERT INTO users (clerk_user_id, gmail, phone_number, address, user_name, profile_image_url, last_sign_in_at)
                 VALUES (:clerk_user_id, :gmail, :phone_number, :address, :user_name, :profile_image_url, NOW())
                 ON DUPLICATE KEY UPDATE
                    gmail = COALESCE(VALUES(gmail), gmail),
                    phone_number = COALESCE(VALUES(phone_number), phone_number),
                    address = COALESCE(VALUES(address), address),
                    user_name = COALESCE(VALUES(user_name), user_name),
                    profile_image_url = COALESCE(VALUES(profile_image_url), profile_image_url),
                    last_sign_in_at = NOW(),
                    updated_at = NOW()'
            );

            $statement->execute([
                'clerk_user_id' => $clerkUserId,
                'gmail' => $gmail,
                'phone_number' => $phone,
                'address' => $address,
                'user_name' => $name,
                'profile_image_url' => $image,
            ]);

            $user = $this->findUserRowByClerkId($clerkUserId);

            $event = $this->pdo->prepare(
                'INSERT INTO sign_in_events (user_id, clerk_session_id, ip_address, user_agent, signed_in_at)
                 VALUES (:user_id, :clerk_session_id, :ip_address, :user_agent, NOW())'
            );

            $event->execute([
                'user_id' => $user['id'],
                'clerk_session_id' => $meta['session_id'] ?? null,
                'ip_address' => $meta['ip_address'] ?? null,
                'user_agent' => $meta['user_agent'] ?? null,
            ]);

            $this->pdo->commit();
        } catch (\Throwable $exception) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $exception;
        }

        return $this->findProfileByClerkId($clerkUserId) ?? $user;
    }

    public function upsertUserFromClerkWebhook(array $clerkUser): array
    {
        $clerkUserId = $clerkUser['id'] ?? null;

        if (!is_string($clerkUserId) || $clerkUserId === '') {
            throw new \InvalidArgumentException('Clerk webhook payload is missing user id.');
        }

        $statement = $this->pdo->prepare(
            'INSERT INTO users (clerk_user_id, gmail, phone_number, address, user_name, profile_image_url)
             VALUES (:clerk_user_id, :gmail, :phone_number, :address, :user_name, :profile_image_url)
             ON DUPLICATE KEY UPDATE
                gmail = COALESCE(VALUES(gmail), gmail),
                phone_number = COALESCE(VALUES(phone_number), phone_number),
                address = COALESCE(VALUES(address), address),
                user_name = COALESCE(VALUES(user_name), user_name),
                profile_image_url = COALESCE(VALUES(profile_image_url), profile_image_url),
                updated_at = NOW()'
        );

        $statement->execute([
            'clerk_user_id' => $clerkUserId,
            'gmail' => $this->emailFromClerkUser($clerkUser),
            'phone_number' => $this->phoneFromClerkUser($clerkUser),
            'address' => $this->addressFromClerkUser($clerkUser),
            'user_name' => $this->nameFromClerkUser($clerkUser),
            'profile_image_url' => $this->firstNonEmpty($clerkUser['image_url'] ?? null),
        ]);

        return $this->findProfileByClerkId($clerkUserId) ?? [];
    }

    public function deleteUserFromClerkWebhook(string $clerkUserId): void
    {
        $statement = $this->pdo->prepare('DELETE FROM users WHERE clerk_user_id = :clerk_user_id');
        $statement->execute(['clerk_user_id' => $clerkUserId]);
    }

    public function findProfileByClerkId(string $clerkUserId): ?array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            return null;
        }

        $statement = $this->pdo->prepare(
            'SELECT m.id, m.sku, m.slug, m.title, m.price_paise, m.currency, um.status,
                    um.razorpay_order_id, um.razorpay_payment_id, um.purchased_at
             FROM user_magazines um
             INNER JOIN magazines m ON m.id = um.magazine_id
             WHERE um.user_id = :user_id
             ORDER BY um.purchased_at DESC'
        );
        $statement->execute(['user_id' => $user['id']]);

        $user['magazines_bought'] = $statement->fetchAll();

        return $user;
    }

    public function updateProfile(string $clerkUserId, array $profile): ?array
    {
        $statement = $this->pdo->prepare(
            'UPDATE users
             SET gmail = COALESCE(:gmail, gmail),
                 phone_number = :phone_number,
                 address = :address,
                 user_name = COALESCE(:user_name, user_name),
                 updated_at = NOW()
             WHERE clerk_user_id = :clerk_user_id'
        );

        $statement->execute([
            'clerk_user_id' => $clerkUserId,
            'gmail' => $this->firstNonEmpty($profile['gmail'] ?? null, $profile['email'] ?? null),
            'phone_number' => $this->firstNonEmpty($profile['phone_number'] ?? null),
            'address' => $this->firstNonEmpty($profile['address'] ?? null),
            'user_name' => $this->firstNonEmpty($profile['user_name'] ?? null, $profile['name'] ?? null),
        ]);

        return $this->findProfileByClerkId($clerkUserId);
    }

    public function getCart(string $clerkUserId): array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            return [];
        }

        $statement = $this->pdo->prepare(
            'SELECT uci.id AS cart_item_id, m.id, m.sku, m.slug, m.title, m.price_paise, m.currency,
                    m.pdf_path, uci.created_at AS added_at
             FROM user_cart_items uci
             INNER JOIN magazines m ON m.id = uci.magazine_id
             WHERE uci.user_id = :user_id
             ORDER BY uci.created_at DESC'
        );
        $statement->execute(['user_id' => $user['id']]);

        return $statement->fetchAll();
    }

    public function addCartItem(string $clerkUserId, string $magazineSlug): array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            throw new \RuntimeException('User profile not found.');
        }

        $magazine = $this->findMagazineBySlug($magazineSlug);

        if ($magazine === null) {
            throw new \RuntimeException('Magazine not found.');
        }

        $statement = $this->pdo->prepare(
            'INSERT INTO user_cart_items (user_id, magazine_id)
             VALUES (:user_id, :magazine_id)
             ON DUPLICATE KEY UPDATE updated_at = NOW()'
        );

        $statement->execute([
            'user_id' => $user['id'],
            'magazine_id' => $magazine['id'],
        ]);

        return $this->getCart($clerkUserId);
    }

    public function removeCartItem(string $clerkUserId, int $cartItemId): array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            return [];
        }

        $statement = $this->pdo->prepare(
            'DELETE FROM user_cart_items
             WHERE id = :cart_item_id AND user_id = :user_id'
        );

        $statement->execute([
            'cart_item_id' => $cartItemId,
            'user_id' => $user['id'],
        ]);

        return $this->getCart($clerkUserId);
    }

    public function cartSummary(string $clerkUserId): array
    {
        $cart = $this->getCart($clerkUserId);
        $total = array_reduce(
            $cart,
            static fn (int $sum, array $item): int => $sum + (int) ($item['price_paise'] ?? 0),
            0
        );

        return [
            'cart' => $cart,
            'total_paise' => $total,
            'currency' => $cart[0]['currency'] ?? 'INR',
        ];
    }

    public function createPendingPurchasesForCart(string $clerkUserId, string $razorpayOrderId): array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            throw new \RuntimeException('User profile not found.');
        }

        $cart = $this->getCart($clerkUserId);

        if ($cart === []) {
            throw new \RuntimeException('Cart is empty.');
        }

        $statement = $this->pdo->prepare(
            'INSERT INTO user_magazines (user_id, magazine_id, razorpay_order_id, status)
             VALUES (:user_id, :magazine_id, :razorpay_order_id, "pending")
             ON DUPLICATE KEY UPDATE status = "pending", updated_at = NOW()'
        );

        foreach ($cart as $item) {
            $statement->execute([
                'user_id' => $user['id'],
                'magazine_id' => $item['id'],
                'razorpay_order_id' => $razorpayOrderId,
            ]);
        }

        return $cart;
    }

    public function markRazorpayOrderPaid(
        string $clerkUserId,
        string $razorpayOrderId,
        string $razorpayPaymentId
    ): array {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            throw new \RuntimeException('User profile not found.');
        }

        try {
            $this->pdo->beginTransaction();

            $purchaseIds = $this->pdo->prepare(
                'SELECT magazine_id
                 FROM user_magazines
                 WHERE user_id = :user_id AND razorpay_order_id = :razorpay_order_id'
            );
            $purchaseIds->execute([
                'user_id' => $user['id'],
                'razorpay_order_id' => $razorpayOrderId,
            ]);
            $magazineIds = array_map(
                static fn (array $row): int => (int) $row['magazine_id'],
                $purchaseIds->fetchAll()
            );

            if ($magazineIds === []) {
                throw new \RuntimeException('No pending purchase found for this payment.');
            }

            $update = $this->pdo->prepare(
                'UPDATE user_magazines
                 SET status = "paid",
                     razorpay_payment_id = :razorpay_payment_id,
                     purchased_at = NOW(),
                     updated_at = NOW()
                 WHERE user_id = :user_id AND razorpay_order_id = :razorpay_order_id'
            );
            $update->execute([
                'user_id' => $user['id'],
                'razorpay_order_id' => $razorpayOrderId,
                'razorpay_payment_id' => $razorpayPaymentId,
            ]);

            $placeholders = implode(',', array_fill(0, count($magazineIds), '?'));
            $delete = $this->pdo->prepare(
                "DELETE FROM user_cart_items
                 WHERE user_id = ? AND magazine_id IN ($placeholders)"
            );
            $delete->execute([$user['id'], ...$magazineIds]);

            $this->pdo->commit();
        } catch (\Throwable $exception) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $exception;
        }

        return $this->findProfileByClerkId($clerkUserId)['magazines_bought'] ?? [];
    }

    public function paidMagazineFile(string $clerkUserId, string $slug): ?array
    {
        $user = $this->findUserRowByClerkId($clerkUserId);

        if ($user === null) {
            return null;
        }

        $statement = $this->pdo->prepare(
            'SELECT m.title, m.slug, m.pdf_file, m.pdf_filename, m.pdf_mime_type
             FROM user_magazines um
             INNER JOIN magazines m ON m.id = um.magazine_id
             WHERE um.user_id = :user_id
               AND m.slug = :slug
               AND um.status = "paid"
             ORDER BY um.purchased_at DESC
             LIMIT 1'
        );
        $statement->execute([
            'user_id' => $user['id'],
            'slug' => $slug,
        ]);

        $file = $statement->fetch();

        return $file === false ? null : $file;
    }

    private function findUserRowByClerkId(string $clerkUserId): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, clerk_user_id, gmail, phone_number, address, user_name, profile_image_url,
                    last_sign_in_at, created_at, updated_at
             FROM users
             WHERE clerk_user_id = :clerk_user_id
             LIMIT 1'
        );
        $statement->execute(['clerk_user_id' => $clerkUserId]);

        $user = $statement->fetch();

        return $user === false ? null : $user;
    }

    private function findMagazineBySlug(string $slug): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, sku, slug, title, price_paise, currency
             FROM magazines
             WHERE slug = :slug AND is_active = 1
             LIMIT 1'
        );
        $statement->execute(['slug' => $slug]);

        $magazine = $statement->fetch();

        return $magazine === false ? null : $magazine;
    }

    private function firstNonEmpty(mixed ...$values): ?string
    {
        foreach ($values as $value) {
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }

    private function emailFromClerkUser(array $user): ?string
    {
        $primaryId = $user['primary_email_address_id'] ?? null;

        foreach ($user['email_addresses'] ?? [] as $email) {
            if (($email['id'] ?? null) === $primaryId) {
                return $this->firstNonEmpty($email['email_address'] ?? null);
            }
        }

        return $this->firstNonEmpty($user['email_addresses'][0]['email_address'] ?? null);
    }

    private function phoneFromClerkUser(array $user): ?string
    {
        $primaryId = $user['primary_phone_number_id'] ?? null;

        foreach ($user['phone_numbers'] ?? [] as $phone) {
            if (($phone['id'] ?? null) === $primaryId) {
                return $this->firstNonEmpty($phone['phone_number'] ?? null);
            }
        }

        return $this->firstNonEmpty($user['phone_numbers'][0]['phone_number'] ?? null);
    }

    private function addressFromClerkUser(array $user): ?string
    {
        $publicAddress = $user['public_metadata']['address'] ?? null;
        $privateAddress = $user['private_metadata']['address'] ?? null;
        $unsafeAddress = $user['unsafe_metadata']['address'] ?? null;

        return $this->firstNonEmpty($publicAddress, $privateAddress, $unsafeAddress);
    }

    private function nameFromClerkUser(array $user): ?string
    {
        $name = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));

        return $this->firstNonEmpty(
            $user['full_name'] ?? null,
            $name,
            $user['username'] ?? null,
            $this->emailFromClerkUser($user)
        );
    }
}
