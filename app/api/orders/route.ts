import { db } from "@/src/lib/db";
import { Resend } from "resend";
import {
  newOrderOwnerEmail,
  orderConfirmationCustomerEmail,
} from "@/src/lib/emails";
import { OrderStatus } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      email,
      phone,
      items,
      fulfillmentType,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
    } = body;

    const order = await db.order.create({
      data: {
        customerName,
        email,
        phone,
        status: OrderStatus.NEW,
        fulfillmentType,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        depositAmount: 25,
        depositPaid: false,
      },
    });

await db.orderItem.createMany({
  data: items.map((item: any) => ({
    orderId: order.id,
    templateId: item.templateId,
    quantity: item.quantity ?? 1,
    woodTypePreference: item.woodTypePreference ?? "",
    modificationRequest: item.modificationRequest ?? "",
    finish: item.finish ?? "",
    size: item.size ?? "",
    location: item.location ?? "",
    engraving: item.engraving ?? "",
  })),
});

    // fetch item names for emails
    const templates = await db.template.findMany({
      where: { id: { in: items.map((i: any) => i.templateId) } },
    });

const emailItems = items.map((item: any) => {
  const template = templates.find((t) => t.id === item.templateId);
  return {
    name: template?.name ?? "Design",
    imageUrl: template?.imageUrl ?? "",
    woodTypePreference: item.woodTypePreference ?? "",
    modificationRequest: item.modificationRequest ?? "",
    finish: item.finish ?? "",
    size: item.size ?? "",
    location: item.location ?? "",
    engraving: item.engraving ?? "",
  };
});

    // send both emails
    await Promise.all([
      resend.emails.send({
        from: "Valae Carving <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL!,
        subject: `New Order from ${customerName}`,
        html: newOrderOwnerEmail({
          customerName,
          email,
          phone,
          fulfillmentType,
          addressLine1,
          addressLine2,
          city,
          state,
          zip,
          orderId: order.id,
          items: emailItems,
        }),
      }),
      resend.emails.send({
        from: "Valae Carving <onboarding@resend.dev>",
        replyTo: process.env.OWNER_EMAIL!,
        to: email,
        subject: "Your order has been received!",
        html: orderConfirmationCustomerEmail({
          customerName,
          orderId: order.id,
          items: emailItems,
        }),
      }),
    ]);

    return Response.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    return new Response("Error creating order", { status: 500 });
  }
}
