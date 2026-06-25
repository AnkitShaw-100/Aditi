<?php

declare(strict_types=1);

use App\Support\Env;

return [
    'app' => [
        'env' => Env::get('APP_ENV', 'production'),
        'debug' => Env::bool('APP_DEBUG', false),
        'url' => Env::get('APP_URL', 'http://localhost:8080'),
        'cors_allowed_origins' => Env::csv('CORS_ALLOWED_ORIGINS', ['http://localhost:5173']),
    ],
    'database' => [
        'host' => Env::get('DB_HOST', '127.0.0.1'),
        'port' => Env::int('DB_PORT', 3306),
        'database' => Env::get('DB_DATABASE', 'aditi'),
        'username' => Env::get('DB_USERNAME', 'root'),
        'password' => Env::get('DB_PASSWORD', ''),
        'charset' => Env::get('DB_CHARSET', 'utf8mb4'),
    ],
    'clerk' => [
        'jwks_url' => Env::get('CLERK_JWKS_URL', 'https://api.clerk.com/v1/jwks'),
        'issuer' => Env::get('CLERK_ISSUER', ''),
        'authorized_parties' => Env::csv('CLERK_AUTHORIZED_PARTIES', []),
        'secret_key' => Env::get('CLERK_SECRET_KEY', ''),
        'webhook_secret' => Env::get('CLERK_WEBHOOK_SECRET', ''),
        'jwks_cache_file' => __DIR__ . '/../storage/cache/clerk_jwks.json',
        'jwks_cache_ttl_seconds' => 3600,
    ],
];
