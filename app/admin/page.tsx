import { db } from "@/src/lib/db";
import AdminTabs from "@/src/components/admin/AdminTabs";

export default async function AdminPage() {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          template: true,
        },
      },
    },
  });

  return <AdminTabs orders={orders} />;
}