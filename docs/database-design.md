# Database Design — Vala Woodworks Portal (MVP)

## Overview

This database supports a custom woodworking order management system.

Customers browse design templates and submit detailed production requests for physical wooden products. Each order contains one or more items with customization details such as size, wood type, finish, placement context, engraving, and modification notes.

The owner manages orders through a full production workflow including quoting, customer approval, production, and fulfillment (shipping or local pickup).

**Database:** Neon (serverless Postgres, free tier)
**ORM:** Prisma

---

## Core Entities

- **Templates** — design catalog customers browse and select from
- **Orders** — customer submissions with contact and fulfillment info
- **OrderItems** — individual requested products within an order
- **Quotes** — custom pricing proposals sent by the admin to the customer

---

## Tables

---

## 1. Templates

Stores all woodworking design templates available to customers.

### Fields

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | Primary key |
| name | string | Display name |
| category | string | Used for filtering |
| imageUrl | string | Cloudinary URL |
| active | boolean | False hides template from customers |
| isCategoryCover | boolean | Reserved — not currently used in UI |
| createdAt | timestamp | Auto-set on creation |

### Notes

- `active = false` hides the template from the customer-facing catalog
- Images are served via Cloudinary with `f_auto,q_auto` transformations
- STL and production files are stored separately and never exposed to customers
- `isCategoryCover` exists in the schema but is not currently used — reserved for a future "category landing" feature

---

## 2. Orders

Represents a full customer submission.

### Fields

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | Primary key |
| customerName | string | |
| email | string | |
| phone | string | |
| fulfillmentType | enum | `SHIPPING` or `PICKUP` |
| addressLine1 | string | Nullable if pickup |
| addressLine2 | string | Nullable |
| city | string | Nullable if pickup |
| state | string | Nullable if pickup |
| zip | string | Nullable if pickup |
| status | enum | See status values below |
| depositPaid | boolean | True once Stripe deposit is confirmed |
| createdAt | timestamp | Auto-set on creation |

### Order Status Values

| Status | Meaning |
|---|---|
| `NEW_REQUEST` | Just submitted, not yet reviewed |
| `IN_REVIEW` | Admin is reviewing |
| `QUOTE_SENT` | Custom quote emailed to customer |
| `AWAITING_APPROVAL` | Waiting on customer to approve/decline quote |
| `APPROVED` | Customer approved the quote |
| `IN_PRODUCTION` | Actively being made |
| `COMPLETED` | Production finished |
| `SHIPPED` | Shipped to customer |
| `READY_FOR_PICKUP` | Available for local pickup |
| `DECLINED` | Customer declined the quote |

### Notes

- Shipping address fields are nullable — only required when `fulfillmentType = SHIPPING`
- A $25 deposit is collected via Stripe at submission; `depositPaid` reflects Stripe webhook confirmation
- Owner is notified by email (via Resend) when a new order is submitted

---

## 3. OrderItems

Represents each requested woodworking item inside an order.

### Fields

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | Primary key |
| orderId | string | Foreign key → Orders.id |
| templateId | string | Foreign key → Templates.id |
| size | string | Nullable — requested dimensions |
| woodTypePreference | string | Nullable — e.g. oak, pine, walnut |
| finish | string | Nullable — e.g. natural, stained, painted |
| location | string | Nullable — intended placement or usage context |
| engraving | string | Nullable — engraving text or description |
| modificationRequest | text | Free-form notes and modification requests |

### Notes

- All customization fields except `modificationRequest` are nullable
- `location` captures where the piece will be used (e.g. home, office, outdoor, gift)
- `engraving` is separate from `modificationRequest` to make it easy to surface in production

---

## 4. Quotes

Stores custom pricing proposals created by the admin after reviewing an order.

### Fields

| Field | Type | Notes |
|---|---|---|
| id | string (cuid) | Primary key |
| orderId | string | Foreign key → Orders.id |
| token | string | Unique token for approve/decline links in email |
| totalPrice | number | Full price of the custom work |
| depositAmount | number | Amount already paid ($25) |
| remainingBalance | number | totalPrice minus depositAmount |
| shippingCost | number | Nullable |
| estimatedDays | string | Human-readable estimate, e.g. "2–3 weeks" |
| notes | string | Nullable — any additional context for the customer |
| status | enum | `PENDING`, `ACCEPTED`, `DECLINED` |
| createdAt | timestamp | Auto-set on creation |

### Notes

- The `token` is used to generate approve/decline URLs in the quote email so customers can respond without an account
- When a customer approves, order status moves to `APPROVED` and owner is notified
- When a customer declines, order status moves to `DECLINED` and owner is notified
- The deposit is non-refundable on decline (noted in quote email to customer)

---

## Relationships

- One **Order** → Many **OrderItems**
- One **Template** → Many **OrderItems**
- One **Order** → One **Quote** (one active quote per order in MVP)

---

## Data Flow

### Customer Flow

1. Browse Templates (filterable by category, searchable by name)
2. Select a design and enter customization details
3. Add to cart (stored in `sessionStorage`)
4. Submit order with contact and fulfillment info
5. Pay $25 deposit via Stripe
6. Order saved in database as `NEW_REQUEST`
7. Customer receives confirmation email; owner receives new order notification

### Admin Flow

1. View incoming orders in admin dashboard
2. Review order and customization details
3. Create a custom quote (price, timeline, shipping cost, notes)
4. Quote email sent to customer with approve/decline links
5. Customer approves or declines via email link
6. Admin notified of decision; order status updates automatically
7. If approved, admin moves order through production stages
8. Customer notified when order moves to In Production
9. Order marked Shipped or Ready for Pickup on completion

---

## Storage

### Images
- Stored in Cloudinary, referenced by URL in the database
- Served with `f_auto,q_auto` and responsive `srcSet` (400w, 600w, 800w)
- Lazy loading used throughout the catalog

### Production Files
- Internal use only — STL files and cutting templates
- Not stored in the database or exposed via any API route
- Currently stored on client's NAS (local network storage)

---

## Out of Scope (MVP)

- Customer accounts or login
- Multiple admin users or role management
- Automated NAS-to-database sync (planned post-MVP)
- Real-time order status tracking for customers
- Payment for remaining balance (only deposit is collected in MVP)