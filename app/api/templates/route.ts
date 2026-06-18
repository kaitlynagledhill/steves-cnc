import { db } from "@/src/lib/db";

export async function GET() {
  try {
    const templates = await db.template.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(templates);
  } catch (error) {
    return new Response("Failed to fetch templates", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, category, imageUrl } = body;

    if (!name || !imageUrl) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    const template = await db.template.create({
      data: {
        name,
        category: category || "General",
        imageUrl,
        active: true,
      },
    });

    return Response.json(template);
  } catch (error) {
    console.error(error);
    return new Response("Failed to create template", {
      status: 500,
    });
  }
}