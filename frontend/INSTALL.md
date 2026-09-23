# TRI CUBE Digital Solutions — Full Installation Guide

End-to-end setup: React frontend + Express/MySQL backend on localhost.

## 1. Prerequisites

- Node.js 20+
- MySQL 8.x
- git
- (Optional) MySQL Workbench

## 2. Clone

```bash
git clone <your-repo-url> tricube
cd tricube
```

## 3. MySQL

```sql
CREATE DATABASE tricube_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tricube'@'localhost' IDENTIFIED BY 'ChangeMe123!';
GRANT ALL PRIVILEGES ON tricube_lms.* TO 'tricube'@'localhost';
FLUSH PRIVILEGES;
```

## 4. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Verify: `curl http://localhost:5000/health`

## 5. Frontend

From project root:

```bash
bun install
bun run dev
```

Create `.env.local` at the project root:

```
VITE_API_URL=http://localhost:5000
```

## 6. Razorpay (test)

1. Enable test mode at https://razorpay.com.
2. Copy Key Id / Secret into `backend/.env`.
3. For webhooks: `ngrok http 5000` and register the URL in Razorpay dashboard.

### Keys must match — single source of truth

`backend/.env` is the ONLY place Razorpay credentials live:

- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` must both be from the same
  account and the same mode (both `rzp_test_*` or both `rzp_live_*`). A
  Test Key Id paired with a Live Secret is the most common cause of
  "Payment server is unreachable" / "Bad request" at checkout.
- `RAZORPAY_WEBHOOK_SECRET` must equal the "Secret" you enter in the
  Razorpay Dashboard → Settings → Webhooks page.
- The frontend does NOT need a Razorpay env var. It reads the Key Id from
  the backend's `/create-order` response so the two sides can never drift.

### Razorpay webhook (required for PDF downloads)

Material PDF downloads are only unlocked after Razorpay's webhook marks the
order paid on the backend. `/verify` will respond `202 { pending: true }` and
the browser will poll until the webhook lands.

1. Start the backend (`npm run dev`) and run `ngrok http 5000`.
2. In Razorpay Dashboard → Settings → Webhooks, add:
   - URL: `https://<your-ngrok-id>.ngrok-free.app/api/materials/webhook`
   - Secret: same value as `RAZORPAY_WEBHOOK_SECRET` in `backend/.env`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
3. Apply the new DB table: `cd backend && npx prisma migrate dev --name material_orders`.

## 7. SMTP

Any SMTP works. For Gmail, create an App password and place it in `SMTP_PASS`. For dev-only use Mailtrap.

## 8. Layout

```
tricube/
├── src/          # React frontend (TanStack Start)
├── backend/      # Express + Prisma + MySQL API
│   ├── prisma/schema.prisma
│   ├── prisma/seed.ts
│   ├── sql/schema.sql
│   └── src/
└── README.md
```

## 9. Troubleshooting

- `ECONNREFUSED 3306` — MySQL is not running.
- `Access denied` — check `DATABASE_URL`.
- CORS error — set `CORS_ORIGIN` in `backend/.env`.
- No emails — inspect `email_logs` table.

## 10. Admin: Manage Services

The public `/services` page is now driven live from the database.

1. Apply the new columns to the `Service` table:
   ```bash
   cd backend
   npx prisma migrate dev --name services_admin_fields_and_sections
   npx prisma db seed
   ```
2. Start both servers (`bun dev` at the root, `bun run dev` inside `backend/`).
3. Visit `http://localhost:8080/admin/services` and sign in with your seeded admin credentials
   (defaults: `tricubedigitalsolutions@gmail.com` / `Admin@12345` — override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
4. From the admin table you can:
   - **Add / edit / delete** services with title, slug, category, price, offer price, duration, description, features, rating.
   - **Upload an image** per service (jpg/png/webp, max 5 MB). Served from `/uploads/`.
   - **Toggle Active** to hide a service without deleting it.
   - **Mark Featured** to pin it first on the public page.

Prices from this table are the source of truth — Razorpay orders use the admin-set `offerPrice` for the corresponding slug.

## Admin — Manage Materials + Bundles

`/materials` is now driven live from the database and supports search, category
filters, and bundle combos.

1. Apply the new tables:
   ```bash
   cd backend
   npx prisma migrate dev --name materials_bundles
   npx prisma db seed
   ```
2. Visit `http://localhost:8080/admin/materials` and sign in with your admin
   credentials.
3. From the **Materials** tab you can:
   - Add / edit / delete each PDF with title, slug, category, price, pages,
     rating, short + long description, and highlights.
   - Upload a **cover image**, the **paid PDF**, and an optional **free
     preview PDF** (all up to 50 MB).
   - Toggle **Active** and **Featured**.
4. From the **Bundles** tab you can combine 2+ materials into a discounted
   combo pack. Each bundle gets its own `/bundles/<slug>` page and a single
   Razorpay checkout that unlocks every included PDF at once.

Prices in the Materials and Bundles tables are the source of truth for
Razorpay orders. Webhook-verified payments issue signed 24-hour download
URLs.

## Admin — Order Timeline (debugging)

Every material/bundle order now records an event log (created → verify
pending → webhook paid → download issued → email sent/failed).

1. Apply the new column:
   ```bash
   cd backend
   npx prisma migrate dev --name material_order_events_log
   ```
2. Visit `http://localhost:8080/admin/materials` → **Orders** tab.
3. Search by email, slug, or Razorpay id; filter by status; click
   **Timeline** on any row to see the full lifecycle with timestamps.