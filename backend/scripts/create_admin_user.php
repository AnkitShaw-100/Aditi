<?php

declare(strict_types=1);

use App\Support\Database;

$config = require __DIR__ . '/../bootstrap.php';

$email = $argv[1] ?? '';
$password = $argv[2] ?? '';
$displayName = $argv[3] ?? 'Admin';

if ($email === '' || $password === '') {
    fwrite(STDERR, "Usage: php backend/scripts/create_admin_user.php <email> <password> [display_name]\n");
    exit(1);
}

if (strlen($password) < 8) {
    fwrite(STDERR, "Password must be at least 8 characters.\n");
    exit(1);
}

$pdo = Database::connect($config['database']);
$statement = $pdo->prepare(
    'INSERT INTO admin_users (email, password_hash, display_name)
     VALUES (:email, :password_hash, :display_name)
     ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        display_name = VALUES(display_name),
        is_active = 1,
        updated_at = NOW()'
);

$statement->execute([
    'email' => strtolower(trim($email)),
    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    'display_name' => $displayName,
]);

echo "Admin user saved: " . strtolower(trim($email)) . PHP_EOL;

