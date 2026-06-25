<?php

declare(strict_types=1);

namespace App\Auth;

use RuntimeException;

final class ClerkJwtVerifier
{
    public function __construct(private readonly array $config)
    {
    }

    public function verify(string $token): array
    {
        [$encodedHeader, $encodedPayload, $encodedSignature] = $this->splitToken($token);
        $header = $this->decodeJson($encodedHeader);
        $payload = $this->decodeJson($encodedPayload);

        if (($header['alg'] ?? '') !== 'RS256') {
            throw new RuntimeException('Unsupported token algorithm.');
        }

        $kid = $header['kid'] ?? null;

        if (!is_string($kid) || $kid === '') {
            throw new RuntimeException('Token missing key id.');
        }

        $jwk = $this->findJwk($kid);
        $publicKey = $this->jwkToPem($jwk);
        $signature = $this->base64UrlDecode($encodedSignature);
        $signingInput = $encodedHeader . '.' . $encodedPayload;

        if (openssl_verify($signingInput, $signature, $publicKey, OPENSSL_ALGO_SHA256) !== 1) {
            throw new RuntimeException('Token signature verification failed.');
        }

        $now = time();
        $clockSkew = 60;

        if (isset($payload['exp']) && (int) $payload['exp'] < ($now - $clockSkew)) {
            throw new RuntimeException('Token expired.');
        }

        if (isset($payload['nbf']) && (int) $payload['nbf'] > ($now + $clockSkew)) {
            throw new RuntimeException('Token not active yet.');
        }

        if (($this->config['issuer'] ?? '') !== '' && ($payload['iss'] ?? '') !== $this->config['issuer']) {
            throw new RuntimeException('Token issuer mismatch.');
        }

        $authorizedParties = $this->config['authorized_parties'] ?? [];

        if ($authorizedParties !== []) {
            $azp = $payload['azp'] ?? '';

            if (!is_string($azp) || !in_array($azp, $authorizedParties, true)) {
                throw new RuntimeException('Token authorized party mismatch.');
            }
        }

        if (!isset($payload['sub']) || !is_string($payload['sub'])) {
            throw new RuntimeException('Token missing subject.');
        }

        return $payload;
    }

    private function splitToken(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new RuntimeException('Malformed JWT.');
        }

        return $parts;
    }

    private function decodeJson(string $encoded): array
    {
        $json = $this->base64UrlDecode($encoded);
        $decoded = json_decode($json, true);

        if (!is_array($decoded)) {
            throw new RuntimeException('Invalid JWT JSON.');
        }

        return $decoded;
    }

    private function findJwk(string $kid): array
    {
        $jwks = $this->fetchJwks();

        foreach ($jwks['keys'] ?? [] as $key) {
            if (($key['kid'] ?? null) === $kid) {
                return $key;
            }
        }

        $jwks = $this->fetchJwks(forceRefresh: true);

        foreach ($jwks['keys'] ?? [] as $key) {
            if (($key['kid'] ?? null) === $kid) {
                return $key;
            }
        }

        throw new RuntimeException('Unable to find matching Clerk JWKS key.');
    }

    private function fetchJwks(bool $forceRefresh = false): array
    {
        $cacheFile = $this->config['jwks_cache_file'];
        $ttl = (int) ($this->config['jwks_cache_ttl_seconds'] ?? 3600);

        if (!$forceRefresh && is_file($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
            $cached = json_decode((string) file_get_contents($cacheFile), true);

            if (is_array($cached)) {
                return $cached;
            }
        }

        $jwksUrl = $this->config['jwks_url'] ?? '';

        if (!is_string($jwksUrl) || $jwksUrl === '') {
            throw new RuntimeException('CLERK_JWKS_URL is required.');
        }

        $json = file_get_contents($jwksUrl);

        if ($json === false) {
            throw new RuntimeException('Unable to fetch Clerk JWKS.');
        }

        $jwks = json_decode($json, true);

        if (!is_array($jwks) || !isset($jwks['keys'])) {
            throw new RuntimeException('Invalid Clerk JWKS response.');
        }

        $cacheDirectory = dirname($cacheFile);

        if (!is_dir($cacheDirectory)) {
            mkdir($cacheDirectory, 0775, true);
        }

        file_put_contents($cacheFile, json_encode($jwks, JSON_UNESCAPED_SLASHES));

        return $jwks;
    }

    private function jwkToPem(array $jwk): string
    {
        if (($jwk['kty'] ?? '') !== 'RSA' || empty($jwk['n']) || empty($jwk['e'])) {
            throw new RuntimeException('Only RSA JWKS keys are supported.');
        }

        $modulus = $this->base64UrlDecode((string) $jwk['n']);
        $exponent = $this->base64UrlDecode((string) $jwk['e']);

        $rsaPublicKey = $this->asn1Sequence(
            $this->asn1Integer($modulus) .
            $this->asn1Integer($exponent)
        );

        $algorithmIdentifier = $this->asn1Sequence(
            $this->asn1ObjectIdentifier("\x2a\x86\x48\x86\xf7\x0d\x01\x01\x01") .
            $this->asn1Null()
        );

        $subjectPublicKeyInfo = $this->asn1Sequence(
            $algorithmIdentifier .
            $this->asn1BitString($rsaPublicKey)
        );

        return "-----BEGIN PUBLIC KEY-----\n"
            . chunk_split(base64_encode($subjectPublicKeyInfo), 64, "\n")
            . "-----END PUBLIC KEY-----\n";
    }

    private function base64UrlDecode(string $value): string
    {
        $padded = str_pad(strtr($value, '-_', '+/'), strlen($value) % 4 === 0 ? strlen($value) : strlen($value) + 4 - strlen($value) % 4, '=', STR_PAD_RIGHT);
        $decoded = base64_decode($padded, true);

        if ($decoded === false) {
            throw new RuntimeException('Invalid base64url value.');
        }

        return $decoded;
    }

    private function asn1Length(int $length): string
    {
        if ($length < 128) {
            return chr($length);
        }

        $hex = dechex($length);

        if (strlen($hex) % 2 === 1) {
            $hex = '0' . $hex;
        }

        $bytes = hex2bin($hex);

        return chr(0x80 | strlen($bytes)) . $bytes;
    }

    private function asn1Sequence(string $value): string
    {
        return "\x30" . $this->asn1Length(strlen($value)) . $value;
    }

    private function asn1Integer(string $value): string
    {
        $value = ltrim($value, "\x00");

        if ($value === '' || (ord($value[0]) & 0x80) !== 0) {
            $value = "\x00" . $value;
        }

        return "\x02" . $this->asn1Length(strlen($value)) . $value;
    }

    private function asn1ObjectIdentifier(string $value): string
    {
        return "\x06" . $this->asn1Length(strlen($value)) . $value;
    }

    private function asn1Null(): string
    {
        return "\x05\x00";
    }

    private function asn1BitString(string $value): string
    {
        return "\x03" . $this->asn1Length(strlen($value) + 1) . "\x00" . $value;
    }
}

