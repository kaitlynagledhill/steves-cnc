export function newOrderOwnerEmail({
  customerName,
  email,
  phone,
  fulfillmentType,
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  items,
  orderId,
}: {
  customerName: string;
  email: string;
  phone: string;
  fulfillmentType: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  orderId: string;
items: {
  name: string;
  imageUrl: string;
  woodTypePreference: string;
  modificationRequest: string;
  finish: string;
  size: string;
  location: string;
  engraving: string;
}[];
}) {
  const isShipping = fulfillmentType === "SHIPPING";

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>🆕 New Custom Order Received</h2>

      <p style="color:#666;">
        A customer has submitted a design request and paid the $25 deposit.
        This order is now ready for review and quoting.
      </p>

      <h3>Customer Info</h3>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Fulfillment:</strong> ${fulfillmentType}</p>

      ${
        isShipping
          ? `
        <h3>Shipping Address</h3>
        <p>${addressLine1}</p>
        ${addressLine2 ? `<p>${addressLine2}</p>` : ""}
        <p>${city}, ${state} ${zip}</p>
      `
          : ""
      }

      <h3>Items Requested</h3>

${items.map((item) => `
  <div style="border:1px solid #eee;padding:12px;margin-bottom:8px;border-radius:6px;display:flex;gap:12px;">
    <img src="${item.imageUrl}" style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #ddd;" />
    <div>
      <p><strong>${item.name}</strong></p>
      ${item.woodTypePreference ? `<p>Wood: ${item.woodTypePreference}</p>` : ""}
      ${item.finish ? `<p>Finish: ${item.finish}</p>` : ""}
      ${item.size ? `<p>Size: ${item.size}</p>` : ""}
      ${item.location ? `<p>Location: ${item.location}</p>` : ""}
      ${item.engraving ? `<p>Engraving: ${item.engraving}</p>` : ""}
      ${item.modificationRequest ? `<p>Notes: ${item.modificationRequest}</p>` : ""}
    </div>
  </div>
`).join("")}

      <h3>Next Step</h3>
      <p>
        Review this request and send a <strong>custom quote</strong> including:
        price, timeline, and shipping (if applicable).
      </p>

      <p style="margin-top:24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/${orderId}"
           style="background:black;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
          View & Create Quote
        </a>
      </p>
    </div>
  `;
}

export function orderConfirmationCustomerEmail({
  customerName,
  orderId,
  items,
}: {
  customerName: string;
  orderId: string;
items: {
  name: string;
  imageUrl: string;
  woodTypePreference: string;
  modificationRequest: string;
  finish: string;
  size: string;
  location: string;
  engraving: string;
}[];
}) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>We’ve Received Your Order 🎉</h2>

      <p>Hi ${customerName}, thanks for your order! Your $25 deposit has been received and your design request is now being reviewed by Steve.</p>

      <p>
        Once reviewed, you’ll receive a <strong>custom quote</strong> including:
        final price, estimated timeline, and shipping or pickup details.
      </p>

      <p><strong>Order ID:</strong> ${orderId}</p>

      <h3>Your Requested Items</h3>

${items.map((item) => `
  <div style="border:1px solid #eee;padding:12px;margin-bottom:8px;border-radius:6px;display:flex;gap:12px;">
    <img src="${item.imageUrl}" style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #ddd;" />
    <div>
      <p><strong>${item.name}</strong></p>
      ${item.woodTypePreference ? `<p>Wood: ${item.woodTypePreference}</p>` : ""}
      ${item.finish ? `<p>Finish: ${item.finish}</p>` : ""}
      ${item.size ? `<p>Size: ${item.size}</p>` : ""}
      ${item.location ? `<p>Location: ${item.location}</p>` : ""}
      ${item.engraving ? `<p>Engraving: ${item.engraving}</p>` : ""}
      ${item.modificationRequest ? `<p>Notes: ${item.modificationRequest}</p>` : ""}
    </div>
  </div>
`).join("")}

      <p style="color:#666;margin-top:24px;font-size:14px;">
        You can reply to this email at any time with questions or changes.
      </p>
    </div>
  `;
}

export function quoteEmail({
  customerName,
  orderId,
  quoteId,
  token,
  totalPrice,
  depositAmount,
  remainingBalance,
  estimatedDays,
  shippingCost,
  fulfillmentType,
  items,
  notes,
}: {
  customerName: string;
  orderId: string;
  quoteId: string;
  token: string;
  totalPrice: number;
  depositAmount: number;
  remainingBalance: number;
  estimatedDays: string;
  shippingCost?: number;
  fulfillmentType: string;
  items: { name: string; imageUrl: string }[];
  notes?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const approveUrl = `${baseUrl}/api/quotes/${quoteId}/approve?token=${token}`;
  const declineUrl = `${baseUrl}/api/quotes/${quoteId}/decline?token=${token}`;

  const shippingLine =
    typeof shippingCost === "number"
      ? `<p><strong>Shipping:</strong> $${shippingCost}</p>`
      : "";

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2>Your Custom Quote is Ready 🧾</h2>

      <p>
        Hi ${customerName}, Steve has reviewed your request and prepared a custom quote for your piece.
      </p>

      <h3>Pricing Breakdown</h3>

      <p><strong>Custom Work Total:</strong> $${totalPrice}</p>
      <p><strong>Deposit Already Paid:</strong> -$${depositAmount}</p>
      <p><strong>Remaining Balance:</strong> $${remainingBalance}</p>

      ${shippingLine}

      <p><strong>Estimated Completion Time:</strong> ${estimatedDays}</p>
      ${notes ? `<p><strong>Quote Notes:</strong> ${notes}</p>` : ""}

      <hr />

      <h3>Your Design</h3>

      ${items
        .map(
          (item) => `
          <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;">
            <img 
              src="${item.imageUrl}" 
              style="width:70px;height:70px;object-fit:cover;border-radius:6px;border:1px solid #eee;" 
            />
            <div>
              <p style="margin:0;"><strong>${item.name}</strong></p>
            </div>
          </div>
        `,
        )
        .join("")}

      <h3>What happens next?</h3>

      <p>
        If you approve this quote, your $${depositAmount} deposit will be applied toward your total and production will begin immediately.
        We’ll coordinate shipping or pickup based on your selection.
      </p>

      <p>
        If you decline this quote, your deposit will remain as a design fee for the time and work already invested.
      </p>

      <div style="margin-top:20px;">
        <a
          href="${approveUrl}"
          style="background:black;color:white;padding:12px 18px;border-radius:6px;text-decoration:none;margin-right:10px;"
        >
          Approve & Start Production
        </a>

        <a
          href="${declineUrl}"
          style="background:#eee;color:black;padding:12px 18px;border-radius:6px;text-decoration:none;"
        >
          Decline Quote
        </a>
      </div>

      <p style="margin-top:24px;color:#666;font-size:12px;">
        If you have any questions, simply reply to this email and we’ll help you out.
      </p>
    </div>
  `;
}

export function inProgressCustomerEmail({
  customerName,
  orderId,
}: {
  customerName: string;
  orderId: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Order Has Been Approved & Is In Production 🛠️</h2>

      <p>Hi ${customerName}, your order has been reviewed and approved. Production has now begun.</p>

      <p>
        We’ll keep you updated as your piece progresses. If you have any questions, just reply to this email.
      </p>

      <p><strong>Order ID:</strong> ${orderId}</p>
    </div>
  `;
}

export function quoteDecisionOwnerEmail({
  customerName,
  orderId,
  decision,
}: {
  customerName: string;
  orderId: string;
  decision: "ACCEPTED" | "DECLINED";
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2>Quote ${decision === "ACCEPTED" ? "Approved" : "Declined"}</h2>

      <p>
        The customer <strong>${customerName}</strong> has ${decision.toLowerCase()} the quote.
      </p>

      <p><strong>Order ID:</strong> ${orderId}</p>

      <p>
        You can view the order in the admin dashboard to continue workflow.
      </p>
    </div>
  `;
}
