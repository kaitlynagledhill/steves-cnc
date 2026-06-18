import { stripe } from "@/src/lib/stripe";
import { db } from "@/src/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    const orderId = session.metadata.orderId;

    await db.order.update({
      where: { id: orderId },
      data: {
        depositPaid: true,
      },
    });
  }

  return new Response("ok");
}