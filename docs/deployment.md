# Deployment — Vala Woodworks Portal

## Hosting

The application is deployed on **Vercel** (free tier), connected to the `main` branch of the GitHub repository. Every push to `main` triggers an automatic production deployment. No manual deploy step is needed.

Build logs and deployment history are visible in the Vercel dashboard under the **Deployments** tab.

---

## Environment Variables

All environment variables are configured in the Vercel dashboard under **Project → Settings → Environment Variables**. For local development, copy these into a `.env.local` file at the project root (never commit this file).

### Database

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string. Found in the Neon dashboard under your project → Connection Details. Use the **pooled** connection string for production. |

### Admin Auth

| Variable | Description |
|---|---|
| `ADMIN_EMAIL` | Email address used to log into the admin dashboard |
| `ADMIN_PASSWORD` | Password used to log into the admin dashboard |
| `NEXTAUTH_URL` | Full URL of the deployed site, e.g. `stevescnc.com`. Use `http://localhost:3000` locally. |
| `NEXTAUTH_SECRET` | Random secret used to sign NextAuth session tokens. Generate with: `openssl rand -base64 32` |

### Cloudinary

| Variable | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Found in the Cloudinary dashboard → Settings → Account |
| `CLOUDINARY_API_KEY` | Found in Cloudinary dashboard → Settings → Access Keys |
| `CLOUDINARY_API_SECRET` | Found in Cloudinary dashboard → Settings → Access Keys. Keep this server-side only — never prefix with `NEXT_PUBLIC_`. |

### Stripe

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Found in Stripe dashboard → Developers → API Keys. Use the `sk_test_` key for development, `sk_live_` for production. |
| `STRIPE_WEBHOOK_SECRET` | Found in Stripe dashboard → Developers → Webhooks. Required for verifying webhook payloads. |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | Set to `"true"` to enable Stripe payment flow. Set to `"false"` to disable payments (orders submit without deposit). |

### Email

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Found in the Resend dashboard → API Keys |
| `EMAIL_FROM` | The sender address for all outgoing emails, e.g. `orders@vala-woodworks.com`. Must be a verified domain in Resend. |
| `OWNER_EMAIL` | The business owner's email address. New order notifications are sent here. |

### URLs

| Variable | Description |
|---|---|
| `BASE_URL` | Base URL of the site. Used in server-side contexts. |
| `NEXT_PUBLIC_APP_URL` | Public base URL, accessible in client-side code. |
| `NEXT_PUBLIC_SITE_URL` | Used in email templates to generate links back to the site (e.g. the "View Order" button in admin notification emails). Should match the production domain. |

> **Note:** `BASE_URL`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_SITE_URL` are redundant and should be consolidated into one variable in a future cleanup pass.

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in values in .env.local

# Run database migrations
npx prisma migrate dev

# Seed the database (if a seed script exists)
npx prisma db seed

# Start the dev server
npm run dev
```

The app runs at `http://localhost:3000`.

To inspect the database locally:

```bash
npx prisma studio
```

---

## Database

The database is hosted on **Neon** (free tier, serverless Postgres).

Migrations are managed by Prisma. To apply schema changes:

```bash
# Create and apply a new migration
npx prisma migrate dev --name describe-your-change

# Apply migrations in production (no prompt)
npx prisma migrate deploy
```

> Vercel does not run migrations automatically on deploy. If you make a schema change, run `npx prisma migrate deploy` manually against the production database, or add it as a build step in `vercel.json`.

---

## Free Tier Limits to Monitor

| Service | Relevant Limit |
|---|---|
| Neon | 0.5 GB storage, 190 compute hours/month |
| Cloudinary | 25 credits/month (storage + transformations + bandwidth) |
| Vercel | 100 GB bandwidth/month, 6,000 build minutes/month |
| Resend | 3,000 emails/month, 100/day |

Cloudinary transformations are cached after the first request, so the ~3,000 initial transformation warm-up (1,045 designs × 3 sizes) is a one-time cost.

---

## Admin Access

The admin dashboard is accessible at `/admin`. It is protected by NextAuth credentials login using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

There is currently one admin account (Steve). No role management or multi-user admin support exists in the MVP.