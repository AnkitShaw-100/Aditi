<?php

declare(strict_types=1);

namespace App\Http;

final class Request
{
    public function __construct(
        private readonly string $method,
        private readonly string $path,
        private readonly array $headers,
        private readonly array $body,
        private readonly string $rawBody,
        private readonly array $server
    ) {
    }

    public static function capture(): self
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $rawBody = file_get_contents('php://input') ?: '';
        $decodedBody = json_decode($rawBody, true);

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            rtrim($path, '/') ?: '/',
            self::headersFromServer($_SERVER),
            is_array($decodedBody) ? $decodedBody : [],
            $rawBody,
            $_SERVER
        );
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function body(): array
    {
        return $this->body;
    }

    public function rawBody(): string
    {
        return $this->rawBody;
    }

    public function only(array $keys): array
    {
        return array_intersect_key($this->body, array_flip($keys));
    }

    public function header(string $name): ?string
    {
        $key = strtolower($name);

        return $this->headers[$key] ?? null;
    }

    public function bearerToken(): ?string
    {
        $authorization = $this->header('Authorization');

        if ($authorization === null || !preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
            return null;
        }

        return trim($matches[1]);
    }

    public function cookie(string $name): ?string
    {
        $value = $_COOKIE[$name] ?? null;

        return is_string($value) && $value !== '' ? $value : null;
    }

    public function origin(): ?string
    {
        return $this->header('Origin');
    }

    public function ip(): ?string
    {
        $ip = $this->server['HTTP_X_FORWARDED_FOR']
            ?? $this->server['REMOTE_ADDR']
            ?? null;

        if (is_string($ip) && str_contains($ip, ',')) {
            return trim(explode(',', $ip)[0]);
        }

        return $ip;
    }

    public function isHttps(): bool
    {
        $https = $this->server['HTTPS'] ?? '';
        $forwardedProto = $this->header('X-Forwarded-Proto');

        return $https === 'on' || $https === '1' || $forwardedProto === 'https';
    }

    public function fullUrl(): string
    {
        $host = $this->server['HTTP_HOST'] ?? 'localhost';
        $requestUri = $this->server['REQUEST_URI'] ?? $this->path;
        $scheme = $this->isHttps() ? 'https' : 'http';

        return $scheme . '://' . $host . $requestUri;
    }

    private static function headersFromServer(array $server): array
    {
        $headers = [];

        foreach ($server as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $header = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$header] = $value;
            }
        }

        if (isset($server['CONTENT_TYPE'])) {
            $headers['content-type'] = $server['CONTENT_TYPE'];
        }

        if (isset($server['CONTENT_LENGTH'])) {
            $headers['content-length'] = $server['CONTENT_LENGTH'];
        }

        return $headers;
    }
}
