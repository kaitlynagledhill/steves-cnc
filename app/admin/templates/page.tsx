import { db } from "@/src/lib/db";
import Link from "next/link";

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>

        <Link
          href="/admin/templates/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Template
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded p-3 hover:shadow"
          >
            <img
              src={template.imageUrl}
              className="w-full h-40 object-cover rounded"
            />

            <div className="mt-2">
              <p className="font-semibold">{template.name}</p>
              <p className="text-sm text-gray-500">
                {template.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}