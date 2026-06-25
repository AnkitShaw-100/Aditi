<?php

declare(strict_types=1);

use App\Auth\ClerkJwtVerifier;
use App\Auth\ClerkUserClient;
use App\Auth\SvixWebhookVerifier;
use App\Http\Request;
use App\Http\Response;
use App\Repository\AdminRepository;
use App\Repository\UserRepository;
use App\Support\Database;

$config = require __DIR__ . '/../bootstrap.php';

set_exception_handler(function (Throwable $exception) use ($config): void {
    $payload = ['error' => 'Server error'];

    if ($config['app']['debug']) {
        $payload['message'] = $exception->getMessage();
        $payload['trace'] = explode("\n", $exception->getTraceAsString());
    }

    Response::json($payload, 500);
});

$request = Request::capture();
Response::cors($config['app']['cors_allowed_origins'], $request);

if ($request->method() === 'OPTIONS') {
    Response::empty(204);
}

$route = $request->method() . ' ' . $request->path();

if ($route === 'GET /api/health') {
    Response::json([
        'status' => 'ok',
        'service' => 'aditi-backend',
    ]);
}

$pdo = Database::connect($config['database']);
$admins = new AdminRepository($pdo);
$users = new UserRepository($pdo);

if ($route === 'POST /api/admin/login') {
    $body = $request->body();
    $email = $body['email'] ?? '';
    $password = $body['password'] ?? '';

    if (!is_string($email) || !is_string($password)) {
        Response::json(['error' => 'Email and password are required'], 422);
    }

    $session = $admins->login($email, $password);

    if ($session === null) {
        Response::json(['error' => 'Invalid admin credentials'], 401);
    }

    Response::json($session);
}

if ($route === 'GET /api/admin/users') {
    requireAdmin($request, $admins);

    Response::json([
        'users' => $admins->listUsers(),
    ]);
}

if ($route === 'POST /api/admin/logout') {
    $admins->logout($request->bearerToken());

    Response::json(['message' => 'Logged out']);
}

if ($route === 'POST /api/webhooks/clerk') {
    $webhookVerifier = new SvixWebhookVerifier($config['clerk']['webhook_secret']);

    try {
        $webhookVerifier->verify(
            $request->rawBody(),
            $request->header('svix-id'),
            $request->header('svix-timestamp'),
            $request->header('svix-signature')
        );
    } catch (Throwable $exception) {
        Response::json(['error' => 'Invalid webhook signature'], 401);
    }

    $event = $request->body();
    $type = $event['type'] ?? '';
    $data = $event['data'] ?? [];

    if (!is_array($data)) {
        Response::json(['error' => 'Invalid webhook payload'], 400);
    }

    if ($type === 'user.created' || $type === 'user.updated') {
        $user = $users->upsertUserFromClerkWebhook($data);

        Response::json([
            'message' => 'Clerk user synced',
            'type' => $type,
            'user' => $user,
        ]);
    }

    if ($type === 'user.deleted') {
        $clerkUserId = $data['id'] ?? null;

        if (is_string($clerkUserId) && $clerkUserId !== '') {
            $users->deleteUserFromClerkWebhook($clerkUserId);
        }

        Response::json([
            'message' => 'Clerk user deleted',
            'type' => $type,
        ]);
    }

    Response::json([
        'message' => 'Webhook ignored',
        'type' => $type,
    ]);
}

$verifier = new ClerkJwtVerifier($config['clerk']);
$clerkUsers = new ClerkUserClient($config['clerk']['secret_key']);

if ($route === 'POST /api/auth/sync-user') {
    $claims = requireClaims($request, $verifier);
    $clerkUserId = (string) $claims['sub'];
    $clerkProfile = array_filter(
        $clerkUsers->getUserProfile($clerkUserId),
        static fn ($value): bool => $value !== null && $value !== ''
    );

    $profile = array_merge(
        $request->only(['gmail', 'email', 'phone_number', 'address', 'user_name', 'name']),
        $clerkProfile
    );

    $user = $users->syncUserFromAuth($clerkUserId, $profile, [
        'session_id' => $claims['sid'] ?? null,
        'ip_address' => $request->ip(),
        'user_agent' => $request->header('User-Agent'),
    ]);

    Response::json([
        'message' => 'User synced',
        'user' => $user,
    ]);
}

if ($route === 'GET /api/me') {
    $claims = requireClaims($request, $verifier);
    $user = $users->findProfileByClerkId((string) $claims['sub']);

    if ($user === null) {
        Response::json(['error' => 'User not found. Call /api/auth/sync-user first.'], 404);
    }

    Response::json(['user' => $user]);
}

if ($route === 'PUT /api/me') {
    $claims = requireClaims($request, $verifier);
    $user = $users->updateProfile(
        (string) $claims['sub'],
        $request->only(['gmail', 'email', 'phone_number', 'address', 'user_name', 'name'])
    );

    if ($user === null) {
        Response::json(['error' => 'User not found. Call /api/auth/sync-user first.'], 404);
    }

    Response::json([
        'message' => 'Profile updated',
        'user' => $user,
    ]);
}

if ($route === 'GET /api/cart') {
    $claims = requireClaims($request, $verifier);

    Response::json([
        'cart' => $users->getCart((string) $claims['sub']),
    ]);
}

if ($route === 'POST /api/cart') {
    $claims = requireClaims($request, $verifier);
    $slug = $request->body()['magazine_slug'] ?? null;

    if (!is_string($slug) || $slug === '') {
        Response::json(['error' => 'magazine_slug is required'], 422);
    }

    try {
        $cart = $users->addCartItem((string) $claims['sub'], $slug);
    } catch (Throwable $exception) {
        Response::json(['error' => $exception->getMessage()], 422);
    }

    Response::json([
        'message' => 'Added to cart',
        'cart' => $cart,
    ]);
}

if ($request->method() === 'DELETE' && preg_match('#^/api/cart/(\d+)$#', $request->path(), $matches)) {
    $claims = requireClaims($request, $verifier);

    Response::json([
        'message' => 'Removed from cart',
        'cart' => $users->removeCartItem((string) $claims['sub'], (int) $matches[1]),
    ]);
}

Response::json(['error' => 'Route not found'], 404);

function requireClaims(Request $request, ClerkJwtVerifier $verifier): array
{
    $token = $request->bearerToken();

    if ($token === null) {
        Response::json(['error' => 'Missing bearer token'], 401);
    }

    try {
        return $verifier->verify($token);
    } catch (Throwable $exception) {
        Response::json(['error' => 'Invalid or expired Clerk token'], 401);
    }
}

function requireAdmin(Request $request, AdminRepository $admins): array
{
    $admin = $admins->adminFromToken($request->bearerToken());

    if ($admin === null) {
        Response::json(['error' => 'Admin login required'], 401);
    }

    return $admin;
}
