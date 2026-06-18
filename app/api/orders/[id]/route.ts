import { db } from "@/src/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Missing order id" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id }, // ← was `orderId`, should be `id`
      include: {
        items: {
          include: {
            template: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({
      ...order,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.template.name,
        category: item.template.category,
        imageUrl: item.template.imageUrl,

        woodTypePreference: item.woodTypePreference,
        finish: item.finish,
        size: item.size,
        location: item.location,
        engraving: item.engraving,
        modificationRequest: item.modificationRequest,
      })),
    });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
