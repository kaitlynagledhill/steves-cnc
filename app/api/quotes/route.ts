import { db } from "@/src/lib/db";
import { Resend } from "resend";
import { quoteEmail } from "@/src/lib/emails";
import { QuoteStatus, OrderStatus } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      totalPrice,
      shippingCost,
      estimatedDays,
      notes,
    } = body;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { template: true } },
        quote: true,
      },
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    // prevent duplicates (extra safety)
    if (order.quote) {
      return new Response("Quote already exists", { status: 400 });
    }

    const depositAmount = order.depositAmount;
    const remainingBalance = totalPrice - depositAmount;

    const quote = await db.quote.create({
      data: {
        orderId,
        totalPrice,
        depositApplied: depositAmount,
        remainingBalance,
        shippingCost,
        estimatedDays,
        notes,
        status: QuoteStatus.SENT,
      },
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.QUOTE_SENT,
      },
    });

    const emailHtml = quoteEmail({
      customerName: order.customerName,
      orderId: order.id,
      quoteId: quote.id,
      token: quote.token,
      totalPrice,
      depositAmount,
      remainingBalance,
      estimatedDays,
      shippingCost,
      fulfillmentType: order.fulfillmentType,
      items: order.items.map((i) => ({
        name: i.template.name,
        imageUrl: i.template.imageUrl,
      })),
      notes: notes,
    });

    await resend.emails.send({
      from: "Valae Carving <onboarding@resend.dev>",
      to: order.email,
      subject: "Your Custom Quote is Ready",
      html: emailHtml,
      replyTo: process.env.OWNER_EMAIL!,
    });

    return Response.json({ success: true, quoteId: quote.id });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create quote", { status: 500 });
  }
}