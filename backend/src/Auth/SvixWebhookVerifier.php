<?php

declare(strict_types=1);

namespace App\Auth;

use RuntimeException;

final class SvixWebhookVerifier
{
    private const TIMESTAMP_TOLERANCE_SECONDS = 300;

    public function __construct(private readonly string $secret)
    {
    }

    public function verify(string $payload, ?string $id, ?string $timestamp, ?string $signature): void
    {
        if ($this->secret === '') {
            throw new RuntimeException('CLERK_WEBHOOK_SECRET is required.');
        }

        if ($id === null || $timestamp === null || $signature === null) {
            throw new RuntimeException('Missing Svix webhook headers.');
        }

        if (!ctype_digit($timestamp)) {
            throw new RuntimeException('Invalid Svix timestamp.');
        }

        if (abs(time() - (int) $timestamp) > self::TIMESTAMP_TOLERANCE_SECONDS) {
            throw new RuntimeException('Svix timestamp outside tolerance.');
        }

        $secret = str_starts_with($this->secret, 'whsec_')
            ? substr($this->secret, 6)
            : $this->secret;

        $secretBytes = base64_decode($secret, true);

        if ($secretBytes === false) {
            throw new RuntimeException('Invalid Svix webhook secret.');
        }

        $signedContent = $id . '.' . $timestamp . '.' . $payload;
        $expected = base64_encode(hash_hmac('sha256', $signedContent, $secretBytes, true));

        foreach (explode(' ', $signature) as $part) {
            if (!str_starts_with($part, 'v1,')) {
                continue;
            }

            $provided = substr($part, 3);

            if (hash_equals($expected, $provided)) {
                return;
            }
        }

        throw new RuntimeException('Svix webhook signature mismatch.');
    }
}

