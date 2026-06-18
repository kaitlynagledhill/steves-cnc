# Database Design — Vala Woodworks Portal (MVP)

## Overview

This database supports a custom woodworking order management system.

Customers browse design templates and submit detailed production requests for physical wooden products.

Each order contains one or more items with customization details such as size, wood type preference, intended placement, and general modification instructions.

The owner manages orders through a full production workflow including proofing, approval, production, and fulfillment (shipping or local pickup).

---

## Core Entities

The system is built around three main entities:

- Templates (designs customers can request)
- Orders (customer submissions)
- OrderItems (individual requested products within an order)

---

## Tables

---

## 1. Templates

Stores all woodworking design templates available for customers.

### Fields

- id (primary key)
- name (string)
- category (string)
- imageUrl (string)
- active (boolean)
- createdAt (timestamp)

### Notes

- `active = false` hides template from customers
- Image is a JPG/PNG preview only
- STL or production files are stored internally and not exposed to customers

---

## 2. Orders

Represents a full customer submission.

### Fields

- id (primary key)
- customerName (string)
- email (string)
- phone (string)
- shippingAddress (string, nullable if pickup selected)
- fulfillmentType (string: "shipping" | "pickup")
- status (string)
- createdAt (timestamp)

### Order Status Values

- New Request
- In Review
- Proof Sent
- Awaiting Approval
- Approved
- In Production
- Completed
- Shipped / Ready for Pickup

### Notes

- One order represents a full submission from a customer
- Status reflects production workflow stage
- Shipping address is optional if pickup is selected

---

## 3. OrderItems

Represents each requested woodworking item inside an order.

### Fields

- id (primary key)
- orderId (foreign key → Orders.id)
- templateId (foreign key → Templates.id)

- sizeRequest (string, nullable)
- woodTypePreference (string, nullable)
- placementContext (text, nullable)
- modificationRequest (text)

### Notes

Each item can include:

- size or dimension requests
- wood preference (e.g., oak, pine, walnut)
- where it will be placed or used
- general modification instructions (free-form)

---

## Relationships

- One Order → Many OrderItems
- One Template → Many OrderItems

---

## Data Flow

### Customer Flow

1. Browse Templates
2. Select a design
3. Add customization details per item
4. Add to cart (frontend only)
5. Submit order with contact + fulfillment info
6. Order stored in database as "New Request"

---

### Admin Flow

1. View incoming orders
2. Review full customization details
3. Send proof to customer (external process or email link)
4. Update order status through production stages
5. Manage templates (add/edit/disable)

---

## Storage Considerations

### Images

- Stored as URLs (cloud storage or server)
- Must be optimized for fast loading
- Lazy loading required for large catalog

---

### Production Files

- Internal use only
- Not exposed to customers
- Stored separately from database records

---

## Constraints

- No customer accounts in MVP
- No payment processing in MVP
- Cart stored in browser only (localStorage/sessionStorage)
- No public access to production files or internal assets

---

## System Design Notes

This schema is designed for a **custom manufacturing workflow system**, not a traditional ecommerce store.

It supports:

- Multi-step production lifecycle
- Human review and proofing stage
- Flexible customization per item
- Shipping and pickup fulfillment