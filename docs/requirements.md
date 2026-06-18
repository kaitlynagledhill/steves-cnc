# Project Requirements — Vala Woodworks Portal (MVP)

## Overview

This project is a web application for a custom woodworking business.

Customers browse design templates and submit custom order requests for wooden products. Each request includes customization details such as size, intended placement, wood type preference, and general modification instructions.

The owner reviews requests, provides design proofs, and manages production and fulfillment including shipping or local pickup in Verdi, NV.

The system is focused on **custom order intake and workflow management** (no payments or user accounts in MVP).

---

## Customer Features

### 1. Template Browsing

- Display woodworking design templates in a grid/gallery layout
- Each template includes:
  - Preview image (JPG/PNG)
  - Name
  - Category

Allow users to:
- Browse all templates
- Search by name
- Filter by category

---

### 2. Template Selection

When a user selects a template:

- Show larger preview image
- Show template name
- Allow user to enter customization details, including:
  - Requested size or dimensions
  - Wood type preference (optional)
  - Intended placement (e.g., home, office, outdoor, etc.)
  - Description of how they want the piece to feel or be used
  - General modification requests (text, design changes, structural changes, etc.)

Users can add the item to a request cart.

---

### 3. Request Cart

- Users can add multiple design requests
- Each cart item includes full customization details
- Users can:
  - View cart items
  - Remove items
  - Edit customization details per item

Cart persists in browser session storage.

---

### 4. Order Submission

At checkout, users must provide:

- Full name
- Email address
- Phone number
- Shipping address (or select local pickup option)

When submitted:

- Order is saved in the database
- Owner is notified via email
- Order is marked as "New Request"

---

## Admin Features

### 1. Admin Login

- Simple password-protected login for owner access

---

### 2. Order Management

Admin can:

- View all incoming orders
- View full order details including:
  - Customer information
  - Ordered items
  - Full customization and usage descriptions
- Update order status:

Workflow statuses:
- New Request
- In Review
- Proof Sent
- Awaiting Approval
- Approved
- In Production
- Completed
- Shipped / Ready for Pickup

---

### 3. Template Management

Admin can:

- Add new templates
  - Upload preview image
  - Add name
  - Add category
- Edit templates
- Disable templates (hide from customers)

---

## Data Requirements

### Templates

- id
- name
- category
- imageUrl
- active
- createdAt

---

### Orders

- id
- customerName
- email
- phone
- shippingAddress
- fulfillmentType (shipping or pickup)
- status
- createdAt

---

### Order Items

- id
- orderId
- templateId
- modificationRequest

---

## System Requirements

- Must support large numbers of templates efficiently (thousands of items)
- Images must be optimized and load quickly
- Cart stored in browser session storage (no accounts required)
- No payment processing included in MVP
- No customer authentication required
- Must support both shipping and local pickup workflows

---

## Summary

This MVP is a custom woodworking order intake and production management system.

Customers browse design templates, submit detailed customization requests, and place orders for physical wooden products. The owner manages incoming requests, provides proofs, and tracks production through to shipping or local pickup fulfillment.