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

    try {
        $user = $users->updateProfile(
            (string) $claims['sub'],
            $request->only(['gmail', 'email', 'phone_number', 'address', 'user_name', 'name'])
        );
    } catch (RuntimeException $exception) {
        Response::json(['error' => $exception->getMessage()], 409);
    }

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

if ($route === 'POST /api/payments/razorpay/order') {
    $claims = requireClaims($request, $verifier);
    $clerkUserId = (string) $claims['sub'];
    $summary = $users->cartSummary($clerkUserId);

    if ($summary['cart'] === [] || $summary['total_paise'] <= 0) {
        Response::json(['error' => 'Cart is empty'], 422);
    }

    $razorpay = $config['razorpay'];

    if ($razorpay['key_id'] === '' || $razorpay['key_secret'] === '') {
        Response::json(['error' => 'Razorpay keys are not configured'], 500);
    }

    $receipt = 'aditi_' . substr(bin2hex(random_bytes(12)), 0, 24);
    $order = razorpayRequest($razorpay, 'POST', '/v1/orders', [
        'amount' => $summary['total_paise'],
        'currency' => $summary['currency'],
        'receipt' => $receipt,
        'notes' => [
            'clerk_user_id' => $clerkUserId,
            'items' => implode(',', array_column($summary['cart'], 'slug')),
        ],
    ]);

    $orderId = $order['id'] ?? null;

    if (!is_string($orderId) || $orderId === '') {
        Response::json(['error' => 'Razorpay did not return an order id'], 502);
    }

    $users->createPendingPurchasesForCart($clerkUserId, $orderId);

    Response::json([
        'key_id' => $razorpay['key_id'],
        'order' => $order,
        'cart' => $summary['cart'],
    ]);
}

if ($route === 'POST /api/payments/razorpay/verify') {
    $claims = requireClaims($request, $verifier);
    $body = $request->body();
    $orderId = $body['razorpay_order_id'] ?? null;
    $paymentId = $body['razorpay_payment_id'] ?? null;
    $signature = $body['razorpay_signature'] ?? null;
    $secret = $config['razorpay']['key_secret'];

    if (!is_string($orderId) || !is_string($paymentId) || !is_string($signature)) {
        Response::json(['error' => 'Payment verification fields are required'], 422);
    }

    if ($secret === '') {
        Response::json(['error' => 'Razorpay keys are not configured'], 500);
    }

    $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $secret);

    if (!hash_equals($expected, $signature)) {
        Response::json(['error' => 'Invalid Razorpay payment signature'], 401);
    }

    $purchases = $users->markRazorpayOrderPaid((string) $claims['sub'], $orderId, $paymentId);

    Response::json([
        'message' => 'Payment verified',
        'purchases' => $purchases,
    ]);
}

if ($request->method() === 'GET' && preg_match('#^/api/magazines/([^/]+)/download$#', $request->path(), $matches)) {
    $claims = requireClaims($request, $verifier);
    $slug = rawurldecode($matches[1]);
    $file = $users->paidMagazineFile((string) $claims['sub'], $slug);

    if ($file === null) {
        Response::json(['error' => 'Magazine not found for this paid user'], 404);
    }

    if (($file['pdf_file'] ?? null) === null || $file['pdf_file'] === '') {
        Response::json(['error' => 'Magazine PDF is not available yet'], 404);
    }

    $filename = safeDownloadFilename(
        $file['pdf_filename'] ?? ($file['slug'] . '.pdf')
    );
    $mime = $file['pdf_mime_type'] ?: 'application/pdf';
    $payload = $file['pdf_file'];

    http_response_code(200);
    header('Content-Type: ' . $mime);
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . strlen($payload));
    echo $payload;
    exit;
}

Response::json(['error' => 'Route not found'], 404);

function razorpayRequest(array $config, string $method, string $path, array $payload = []): array
{
    $url = 'https://api.razorpay.com' . $path;
    $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
    $headers = [
        'Authorization: Basic ' . base64_encode($config['key_id'] . ':' . $config['key_secret']),
        'Content-Type: application/json',
    ];

    $context = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", $headers),
            'content' => $body === false ? '{}' : $body,
            'ignore_errors' => true,
            'timeout' => 20,
        ],
    ]);

    $response = file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? '';
    preg_match('#\s(\d{3})\s#', $statusLine, $matches);
    $status = (int) ($matches[1] ?? 0);
    $data = json_decode($response === false ? '' : $response, true);

    if ($status < 200 || $status >= 300 || !is_array($data)) {
        Response::json([
            'error' => 'Unable to create Razorpay order',
            'details' => is_array($data) ? ($data['error']['description'] ?? $data) : null,
        ], 502);
    }

    return $data;
}

function safeDownloadFilename(string $filename): string
{
    $filename = preg_replace('/[^A-Za-z0-9._-]+/', '-', $filename) ?: 'aditi-magazine.pdf';

    return str_ends_with(strtolower($filename), '.pdf') ? $filename : $filename . '.pdf';
}

function requireClaims(Request $request, ClerkJwtVerifier $verifier): array
{
    global $config;

    $token = $request->bearerToken();

    if ($token === null) {
        Response::json(['error' => 'Missing bearer token'], 401);
    }

    try {
        return $verifier->verify($token);
    } catch (Throwable $exception) {
        $payload = ['error' => 'Invalid or expired Clerk token'];

        if (($config['app']['debug'] ?? false) === true) {
            $payload['message'] = $exception->getMessage();
        }

        Response::json($payload, 401);
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
