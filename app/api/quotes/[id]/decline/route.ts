import { db } from "@/src/lib/db";
import { QuoteStatus, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import { quoteDecisionOwnerEmail } from "@/src/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  // 1. update quote
  await db.quote.update({
    where: { id },
    data: { status: QuoteStatus.DECLINED },
  });

  // 2. update order
  await db.order.update({
    where: { id: quote.orderId },
    data: { status: OrderStatus.CLOSED },
  });

  // 3. notify OWNER only
  await resend.emails.send({
    from: "Valae Carving <onboarding@resend.dev>",
    to: process.env.OWNER_EMAIL!,
    subject: "Quote Declined",
    html: quoteDecisionOwnerEmail({
      customerName: quote.order.customerName,
      orderId: quote.orderId,
      decision: "DECLINED",
    }),
  });

  // 4. confirmation page
  return new Response(
    `
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2>Quote Declined</h2>
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
