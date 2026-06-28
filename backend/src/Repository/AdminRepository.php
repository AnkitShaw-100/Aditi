<?php

declare(strict_types=1);

namespace App\Repository;

use PDO;

final class AdminRepository
{
    private const SESSION_TTL_SECONDS = 86400;

    public function __construct(private readonly PDO $pdo)
    {
    }

    public function login(string $email, string $password): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, email, password_hash, display_name, is_active
             FROM admin_users
             WHERE email = :email
             LIMIT 1'
        );
        $statement->execute(['email' => strtolower(trim($email))]);
        $admin = $statement->fetch();

        if ($admin === false || (int) $admin['is_active'] !== 1) {
            return null;
        }

        if (!password_verify($password, $admin['password_hash'])) {
            return null;
        }

        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_TTL_SECONDS);

        $this->pdo->beginTransaction();

        try {
            $session = $this->pdo->prepare(
                'INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at, last_used_at)
                 VALUES (:admin_user_id, :token_hash, :expires_at, NOW())'
            );
            $session->execute([
                'admin_user_id' => $admin['id'],
                'token_hash' => $tokenHash,
                'expires_at' => $expiresAt,
            ]);

            $update = $this->pdo->prepare(
                'UPDATE admin_users SET last_login_at = NOW(), updated_at = NOW() WHERE id = :id'
            );
            $update->execute(['id' => $admin['id']]);

            $this->pdo->commit();
        } catch (\Throwable $exception) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $exception;
        }

        return [
            'token' => $token,
            'expires_at' => $expiresAt,
            'admin' => [
                'id' => (int) $admin['id'],
                'email' => $admin['email'],
                'display_name' => $admin['display_name'],
            ],
        ];
    }

    public function adminFromToken(?string $token): ?array
    {
        if ($token === null || $token === '') {
            return null;
        }

        $statement = $this->pdo->prepare(
            'SELECT au.id, au.email, au.display_name
             FROM admin_sessions s
             INNER JOIN admin_users au ON au.id = s.admin_user_id
             WHERE s.token_hash = :token_hash
               AND s.expires_at > NOW()
               AND au.is_active = 1
             LIMIT 1'
        );
        $statement->execute(['token_hash' => hash('sha256', $token)]);
        $admin = $statement->fetch();

        if ($admin === false) {
            return null;
        }

        $touch = $this->pdo->prepare(
            'UPDATE admin_sessions SET last_used_at = NOW() WHERE token_hash = :token_hash'
        );
        $touch->execute(['token_hash' => hash('sha256', $token)]);

        return $admin;
    }

    public function logout(?string $token): void
    {
        if ($token === null || $token === '') {
            return;
        }

        $statement = $this->pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = :token_hash');
        $statement->execute(['token_hash' => hash('sha256', $token)]);
    }

    public function listUsers(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, clerk_user_id, email, phone_number, dob, username,
                    profile_image_url, profile_completed_at, last_sign_in_at, created_at, updated_at
             FROM users
             ORDER BY created_at DESC'
        );

        $users = $statement->fetchAll();

        foreach ($users as &$user) {
            $user['cart_items'] = $this->cartItemsForUser((int) $user['id']);
            $user['magazines_bought'] = $this->purchasesForUser((int) $user['id']);
        }

        return $users;
    }

    private function cartItemsForUser(int $userId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT uci.id AS cart_item_id, m.title, m.slug, m.price_paise, m.currency, uci.created_at AS added_at
             FROM user_cart_items uci
             INNER JOIN magazines m ON m.id = uci.magazine_id
             WHERE uci.user_id = :user_id
             ORDER BY uci.created_at DESC'
        );
        $statement->execute(['user_id' => $userId]);

        return $statement->fetchAll();
    }

    private function purchasesForUser(int $userId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT um.id AS purchase_id, m.title, m.slug, m.price_paise, m.currency, um.status,
                    um.razorpay_order_id, um.razorpay_payment_id, um.purchased_at
             FROM user_magazines um
             INNER JOIN magazines m ON m.id = um.magazine_id
             WHERE um.user_id = :user_id
             ORDER BY um.purchased_at DESC, um.created_at DESC'
        );
        $statement->execute(['user_id' => $userId]);

        return $statement->fetchAll();
    }
}
