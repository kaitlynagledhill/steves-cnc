import { db } from "@/src/lib/db";

// GET single design
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return new Response("Missing id", { status: 400 });
    }

    const design = await db.template.findUnique({
      where: { id },
    });

    if (!design) {
      return new Response("Not found", { status: 404 });
    }

    return Response.json(design);
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch design", { status: 500 });
  }
}

// UPDATE design (admin edit)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return new Response("Missing id", { status: 400 });
    }

    const data: any = {
      name: body.name,
      category: body.category,
      imageUrl: body.imageUrl,
      active: body.active,
    };

    /**
     * ⭐ CATEGORY COVER LOGIC
     * If this design is being set as the cover for its category,
     * first reset all others in that category.
     */
    if (body.isCategoryCover === true) {
      await db.template.updateMany({
        where: {
          category: body.category,
        },
        data: {
          isCategoryCover: false,
        },
      });

      data.isCategoryCover = true;
    }

    const updated = await db.template.update({
      where: { id },
      data,
    });

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return new Response("Failed to update design", { status: 500 });
  }
}
