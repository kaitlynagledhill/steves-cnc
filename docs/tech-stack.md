# Tech Stack — Steve's CNC

## Overview

Full-stack web application built with Next.js, deployed on Vercel, using a Neon Postgres database via Prisma ORM and Cloudinary for image delivery.

---

## Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fuzzy Search | Fuse.js |
| Auth (admin) | NextAuth.js |

### Notable UI Patterns

- Seeded shuffle for randomized-but-stable design grid on page load
- Debounced search input (300ms) with Fuse.js fuzzy matching on name and category
- Favorites persisted to `localStorage`
- Cart persisted to `sessionStorage` (cleared on browser close, by design)
- Mobile category filter uses a collapsible dropdown; desktop uses a sticky sidebar
- Bilingual UI — English and Spanish via a custom `translations` object and `LanguageContext`

---

## Backend

| Layer | Technology |
|---|---|
| API Routes | Next.js App Router API routes |
| ORM | Prisma |
| Database | Neon (serverless Postgres, free tier) |
| Image Storage | Cloudinary (free tier) |
| Email | Resend |
| Payments | Stripe |

---

## Image Handling

Images are stored in Cloudinary and served with URL-based transformations:

```
/upload/f_auto,q_auto,w_{size}/
```

- `f_auto` — serves WebP or AVIF based on browser support
- `q_auto` — Cloudinary selects optimal quality/size tradeoff
- `srcSet` provides 400w / 600w / 800w variants
- `sizes` attribute ensures mobile devices receive the 400w version

This significantly reduces Cloudinary bandwidth usage compared to serving originals.

---

## Email

Transactional emails are sent via **Resend**. The following emails are implemented:

| Trigger | Recipient |
|---|---|
| New order submitted | Owner |
| New order submitted | Customer (confirmation) |
| Quote created by admin | Customer |
| Quote approved by customer | Owner |
| Quote declined by customer | Owner |
| Order moved to In Production | Customer |

Email templates live in `src/lib/emails.ts` and are plain HTML strings.

---

## Payments

Stripe is integrated for deposit collection. Customers pay a **$25 deposit** at order submission. The deposit is tracked against the quote total and deducted from the remaining balance shown to the customer.

Payment feature can be toggled via the `NEXT_PUBLIC_ENABLE_PAYMENTS` environment variable.

---

## Auth

Admin authentication is handled by **NextAuth.js** using a credentials provider (email + password). There is no customer-facing authentication — orders are submitted anonymously with contact details only.

---

## Hosting & Deployment

| Service | Purpose |
|---|---|
| Vercel | Hosting, CI/CD (free tier) |
| Neon | Serverless Postgres database (free tier) |
| Cloudinary | Image storage and delivery (free tier) |
| Resend | Transactional email |
| Stripe | Payment processing |

Deployments trigger automatically on push to `main`. No manual deploy step required.

---

## Internationalization

The customer-facing UI supports **English and Spanish**. Language selection is managed via a `LanguageContext` provider. Translations are stored in a `translations` object keyed by language code (`en`, `es`). The admin UI is English only.