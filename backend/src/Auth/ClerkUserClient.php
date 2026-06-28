<?php

declare(strict_types=1);

namespace App\Auth;

final class ClerkUserClient
{
    public function __construct(private readonly string $secretKey)
    {
    }

    public function getUserProfile(string $clerkUserId): array
    {
        if ($this->secretKey === '') {
            return [];
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => [
                    'Authorization: Bearer ' . $this->secretKey,
                    'Accept: application/json',
                ],
                'timeout' => 10,
            ],
        ]);

        $json = @file_get_contents(
            'https://api.clerk.com/v1/users/' . rawurlencode($clerkUserId),
            false,
            $context
        );

        if ($json === false) {
            return [];
        }

        $user = json_decode($json, true);

        if (!is_array($user)) {
            return [];
        }

        return [
            'email' => $this->primaryEmail($user),
            'phone_number' => $this->primaryPhone($user),
            'username' => $this->displayName($user),
            'profile_image_url' => $user['image_url'] ?? null,
        ];
    }

    private function primaryEmail(array $user): ?string
    {
        $primaryId = $user['primary_email_address_id'] ?? null;

        foreach ($user['email_addresses'] ?? [] as $email) {
            if (($email['id'] ?? null) === $primaryId) {
                return $email['email_address'] ?? null;
            }
        }

        return $user['email_addresses'][0]['email_address'] ?? null;
    }

    private function primaryPhone(array $user): ?string
    {
        $primaryId = $user['primary_phone_number_id'] ?? null;

        foreach ($user['phone_numbers'] ?? [] as $phone) {
            if (($phone['id'] ?? null) === $primaryId) {
                return $phone['phone_number'] ?? null;
            }
        }

        return $user['phone_numbers'][0]['phone_number'] ?? null;
    }

    private function displayName(array $user): ?string
    {
        if (!empty($user['full_name'])) {
            return $user['full_name'];
        }

        $name = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));

        if ($name !== '') {
            return $name;
        }

        return $user['username'] ?? null;
    }
}
