import { db } from "@/src/lib/db";
import { QuoteStatus, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import {
  inProgressCustomerEmail,
  quoteDecisionOwnerEmail,
} from "@/src/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request, context: any) {
  const { params } = context;
  const { id } = await params; // 🔥 THIS IS THE FIX

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  const quote = await db.quote.findUnique({
    where: { id },
    include: { order: true },
  });

  if (!quote) {
    return new Response("Not found", { status: 404 });
  }

  if (quote.token !== token) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (quote.status !== QuoteStatus.SENT) {
    return new Response("Already processed", { status: 400 });
  }

  await db.quote.update({
    where: { id: quote.id },
    data: { status: QuoteStatus.ACCEPTED },
  });

  await db.order.update({
    where: { id: quote.orderId },
    data: { status: OrderStatus.IN_PROGRESS },
  });

  // Email customer
  await resend.emails.send({
    from: "Valae Carving <onboarding@resend.dev>",
    to: quote.order.email,
    subject: "Your Order is Now in Production 🛠️",
    html: inProgressCustomerEmail({
      customerName: quote.order.customerName,
      orderId: quote.orderId,
    }),
    replyTo: process.env.OWNER_EMAIL!,
  });

  // Email owner
  await resend.emails.send({
    from: "Valae Carving <onboarding@resend.dev>",
    to: process.env.OWNER_EMAIL!,
    subject: "Quote Approved",
    html: quoteDecisionOwnerEmail({
      customerName: quote.order.customerName,
      orderId: quote.orderId,
      decision: "ACCEPTED",
    }),
  });

  return new Response(
    `
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2 style="color:green;">Quote Approved</h2>
        <p>This has been recorded.</p>
        <p>You can close this tab.</p>
      </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    },
  );
}
