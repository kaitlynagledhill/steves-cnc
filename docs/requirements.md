# Project Requirements — Steve's CNC (MVP)

## Overview

A web application for a custom woodworking business based in Verdi, NV.

Customers browse a catalog of design templates and submit custom order requests for wooden products. Each request includes detailed customization options. The owner reviews requests, sends custom quotes, and manages production through to shipping or local pickup.

The system is a **custom order intake and production management tool** — not a traditional e-commerce store. Pricing is custom per order. A $25 deposit is collected at submission to confirm intent.

---

## Customer Features

### 1. Template Browsing

Display woodworking design templates in a responsive grid.

Each template shows:
- Preview image
- Name
- Category

Browsing controls:
- Search by name (fuzzy search via Fuse.js)
- Filter by category
  - Desktop: sticky sidebar
  - Mobile: collapsible dropdown
- Save favorites (persisted to `localStorage`)
- Load more pagination (21 items per page)
- UI available in **English and Spanish**

---

### 2. Template Detail & Customization

When a user selects a template:

- Show preview image, name, and category
- Allow user to enter customization details:
  - **Size** — requested dimensions
  - **Wood type preference** — e.g. oak, pine, walnut (optional)
  - **Finish** — e.g. natural, stained, painted (optional)
  - **Location / placement** — where the piece will be used or displayed
  - **Engraving** — engraving text or description (optional)
  - **Modification requests** — free-form notes on design or structural changes

User can add the item to their request cart.

---

### 3. Request Cart

- Users can add multiple design requests
- Each cart item retains full customization details
- Users can view, edit, and remove cart items
- Cart persists in `sessionStorage` (clears on browser close — intentional, no accounts in MVP)

---

### 4. Order Submission & Deposit

At checkout, users provide:
- Full name
- Email address
- Phone number
- Fulfillment preference: **Shipping** or **Local Pickup** (Verdi, NV)
- Shipping address (required if shipping selected)

On submission:
- $25 deposit collected via **Stripe**
- Order saved in database as `NEW_REQUEST`
- Customer receives confirmation email with order summary
- Owner receives new order notification email with full details and a link to the admin dashboard

---

## Admin Features

### 1. Admin Login

Password-protected login via NextAuth credentials provider. Single admin account (owner). No self-registration.

---

### 2. Order Management

Admin can:
- View all orders with status indicators
- View full order detail including customer info, items, and all customization fields
- Create a **custom quote** per order including:
  - Total price
  - Deposit already paid
  - Remaining balance
  - Shipping cost (if applicable)
  - Estimated completion time
  - Optional notes
- Quote is emailed to customer automatically on creation
- Customer approves or declines via link in email (no login required)
- Admin is notified of customer decision by email
- Update order status manually through production stages

**Order status workflow:**

```
New Request → In Review → Quote Sent → Awaiting Approval
→ Approved → In Production → Completed → Shipped / Ready for Pickup
```

Declined quotes move order to `DECLINED` status.

---

### 3. Template Management

Admin can:
- View all templates (filterable by active/inactive, searchable)
- Add new templates (name, category, image upload to Cloudinary)
- Edit existing templates
- Disable templates (hide from customer catalog without deleting)
- Paginated view (21 per page) with load more

---

## Email Notifications

All emails sent via **Resend**.

| Event | Recipient |
|---|---|
| Order submitted | Owner — full order details + link to admin |
| Order submitted | Customer — confirmation with item summary |
| Quote created | Customer — pricing breakdown + approve/decline links |
| Quote approved | Owner — notification with order link |
| Quote declined | Owner — notification with order link |
| Order moved to In Production | Customer — status update |

---

## Non-Functional Requirements

- Must support 1,000+ templates efficiently (pagination, optimized images)
- Images served via Cloudinary with responsive sizing (`f_auto`, `q_auto`, `srcSet`)
- Mobile-first responsive design
- No customer authentication
- No payment for remaining balance in MVP (deposit only)
- Admin is English-only; customer UI supports English and Spanish

---

## Out of Scope (MVP)

- Customer accounts or order tracking portal
- Remaining balance payment collection
- Automated NAS-to-pending-designs sync (planned)
- Multiple admin users
- Inventory or stock tracking
- Public API

---

## Summary

Steve's CNC is a custom order intake and production management system for a woodworking business. Customers browse 1,000+ design templates, configure customization details, and submit requests with a $25 deposit. The owner receives notifications, creates custom quotes, and manages production workflow through a private admin dashboard.