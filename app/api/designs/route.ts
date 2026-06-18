import { db } from "@/src/lib/db";

// GET all carvings/designs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");

    const where =
      status === "inactive"
        ? { active: false }
        : status === "active"
          ? { active: true }
          : { active: true };

    const designs = await db.template.findMany({
      where,
      orderBy: [{ active: "desc" }, { createdAt: "desc" }],
    });

    return Response.json(designs);
  } catch (error) {
    return new Response("Failed to fetch designs", { status: 500 });
  }
}

// CREATE new carving/design
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, category, imageUrl } = body;

    if (!name || !imageUrl) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    const design = await db.template.create({
      data: {
        name,
        category: category || "General",
        imageUrl,
        active: true,
      },
    });

    return Response.json(design);
  } catch (error) {
    console.error(error);
    return new Response("Failed to create design", {
      status: 500,
    });
  }
}
