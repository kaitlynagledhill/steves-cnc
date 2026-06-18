import { db } from "@/src/lib/db";
import { Resend } from "resend";
import { inProgressCustomerEmail } from "@/src/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
    });

    if (status === "In Progress") {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.OWNER_EMAIL!,
        to: updatedOrder.email,
        subject: "Your order is now in progress!",
        html: inProgressCustomerEmail({
          customerName: updatedOrder.customerName,
          orderId: updatedOrder.id,
        }),
      });
    }

    return Response.json(updatedOrder);
  } catch (err) {
    console.error(err);
    return new Response("Failed to update status", { status: 500 });
  }
}
