import { stripe } from "@/src/lib/stripe";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Design Deposit",
            description: "Custom carving design deposit",
          },
          unit_amount: 2500, // $25
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
  });

  return Response.json({ url: session.url });
}