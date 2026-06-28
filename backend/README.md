# ADITI PHP Backend

This backend is the first PHP/MySQL slice for the LP flow:

1. User signs in with Clerk on the frontend.
2. Frontend sends the Clerk session token to this backend.
3. Backend verifies the Clerk JWT with Clerk JWKS.
4. Backend upserts the user into MySQL with Clerk email, phone number, date of birth, username, and purchased magazines.

## Setup

Copy the environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Update `backend/.env` with your MySQL and Clerk values.

Create the database and run the migration:

```sql
CREATE DATABASE aditi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then import:

```powershell
mysql -u root -p aditi < backend\database\migrations\001_create_auth_users_and_magazines.sql
```

For an existing database, replace the old dummy magazine catalogue with the real ADITI issue:

```powershell
Get-Content -Raw backend\database\migrations\004_replace_catalogue_with_aditi_magazine.sql | mysql -u root -p aditi
php backend\scripts\import_magazine_pdf.php "C:\Users\Ankit\Desktop\ADITI Strategy & Defence Magazine.pdf"
```

The import script stores the PDF in `magazines.pdf_file` and keeps the public frontend from exposing the paid file directly.

Run locally:

```powershell
php -S localhost:8080 -t backend\public
```

## Protected Endpoints

### `POST /api/auth/sync-user`

Headers:

```http
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

Body fields are optional. Use them for profile fields Clerk does not include in the session token:

```json
{
  "username": "Aditi Reader",
  "email": "reader@example.com",
  "phone_number": "+919999999999",
  "dob": "1995-08-15"
}
```

### `GET /api/me`

Returns the stored user profile and purchased magazines for the authenticated Clerk user.

### `PUT /api/me`

Updates profile fields collected before checkout:

```json
{
  "username": "Aditi Reader",
  "email": "reader@example.com",
  "phone_number": "+919999999999",
  "dob": "1995-08-15"
}
```

### Cart Endpoints

```text
GET /api/cart
POST /api/cart
DELETE /api/cart/{cart_item_id}
```

Add an article/magazine to cart:

```json
{
  "magazine_slug": "ladakh-question-after-buffer-zones"
}
```

## Clerk Webhooks

For production user syncing, configure Clerk to call:

```text
POST https://your-domain.com/api/webhooks/clerk
```

Subscribe to these events:

```text
user.created
user.updated
user.deleted
```

Then add the endpoint signing secret to `backend/.env`:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

## Razorpay Payments

Set these values in `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

The checkout flow creates a Razorpay order from the signed-in user's cart, verifies the Razorpay signature after payment, marks `user_magazines.status` as `paid`, clears the purchased item from cart, and enables protected PDF download through:

```text
GET /api/magazines/{slug}/download
```

For local testing, expose the PHP backend with a tunnel such as ngrok:

```powershell
ngrok http 8080
```

Use the generated HTTPS URL in Clerk Dashboard:

```text
https://your-ngrok-url.ngrok-free.app/api/webhooks/clerk
```

## Admin Login

Run the migration:

```powershell
Get-Content "backend\database\migrations\003_create_admin_auth.sql" | mysql -u aditi_admin -p aditi
```

Create or reset an admin user:

```powershell
php backend\scripts\create_admin_user.php admin@aditi.in "StrongPassword123" "ADITI Admin"
```

Admin endpoints:

```text
POST /api/admin/login
GET /api/admin/users
POST /api/admin/logout
```

## Frontend Call Shape

From React with Clerk:

```js
const token = await getToken();

await fetch("http://localhost:8080/api/auth/sync-user", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: user.fullName,
    email: user.primaryEmailAddress?.emailAddress,
    phone_number: user.primaryPhoneNumber?.phoneNumber,
    dob,
  }),
});
```
