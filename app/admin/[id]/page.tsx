import { db } from "@/src/lib/db";
import StatusControls from "./StatusControls";
import Link from "next/link";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { template: true } },
      quote: true,
    },
  });

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-64 text-stone-400 text-sm">
        Order not found.
      </div>
    );
  }

  const isShipping = order.fulfillmentType === "SHIPPING";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
          Order
        </p>
        <h1 className="font-serif text-2xl text-stone-900 tracking-tight">
          {order.customerName}
        </h1>
        <p className="text-xs text-stone-400 mt-1 font-mono">{order.id}</p>
      </div>

      {/* Customer + shipping */}
      <div className={isShipping ? "grid md:grid-cols-2 gap-4" : "grid gap-4"}>
        <Card title="Customer">
          <DetailRow label="Name" value={order.customerName} />
          <DetailRow label="Email" value={order.email} />
          <DetailRow label="Phone" value={order.phone} />
          <DetailRow label="Fulfillment" value={order.fulfillmentType} />
          <DetailRow label="Status" value={order.status} highlight />
        </Card>

        {isShipping && (
          <Card title="Shipping address">
            <p className="text-sm text-stone-700">{order.addressLine1}</p>
            {order.addressLine2 && (
              <p className="text-sm text-stone-700">{order.addressLine2}</p>
            )}
            <p className="text-sm text-stone-700">
              {order.city}, {order.state} {order.zip}
            </p>
          </Card>
        )}
      </div>

      {/* Status controls */}
      <Card title="Order status">
        <StatusControls orderId={order.id} initialStatus={order.status} />
      </Card>

      {/* Quote */}
      <Card title="Quote">
        {order.quote ? (
          <p className="text-sm text-stone-500">Quote already created.</p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              No quote created yet — review the items below and create a custom
              price.
            </p>
            <Link
              href={`/admin/orders/${order.id}/quote`}
              className="
                ml-4 flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium
                bg-stone-900 text-white hover:bg-[#B07A3B] transition-colors duration-200
              "
            >
              Create quote
            </Link>
          </div>
        )}
      </Card>

      {/* Items */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-4">
          Items
        </p>

        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl border border-stone-100 bg-white"
            >
              <img
                src={item.template.imageUrl}
                alt={item.template.name}
                className="w-24 h-24 object-cover rounded-lg border border-stone-100 flex-shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">
                  {item.template.name}
                </p>
                <p className="text-xs text-stone-400">
                  {item.template.category}
                </p>
                {item.woodTypePreference && (
                  <DetailLine label="Wood" value={item.woodTypePreference} />
                )}
                {item.finish && (
                  <DetailLine label="Finish" value={item.finish} />
                )}
                {item.size && <DetailLine label="Size" value={item.size} />}
                {item.location && (
                  <DetailLine label="Location" value={item.location} />
                )}
                {item.engraving && (
                  <DetailLine label="Engraving" value={item.engraving} />
                )}
                {item.modificationRequest && (
                  <DetailLine label="Notes" value={item.modificationRequest} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────── */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-5 flex flex-col gap-3">
      <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
        {title}
      </p>
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-400">{label}</span>
      <span
        className={highlight ? "text-[#B07A3B] font-medium" : "text-stone-700"}
      >
        {value}
      </span>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-xs text-stone-500">
      <span className="text-stone-400">{label}: </span>
      {value}
    </p>
  );
}
