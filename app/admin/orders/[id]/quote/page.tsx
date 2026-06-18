import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import QuoteForm from "./quote-form";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          template: true,
        },
      },
      quote: true,
    },
  });

  if (!order) return <div className="p-10">Order not found</div>;

  // prevent duplicate quotes
  if (order.quote) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold">Quote already exists</h1>
        <p className="text-gray-600 mt-2">Status: {order.quote.status}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
          Create quote
        </p>

        <h1 className="font-serif text-3xl text-stone-900 tracking-tight mt-1">
          {order.customerName}
        </h1>

        <p className="text-sm text-stone-400 mt-2">{order.email}</p>
      </div>

      {/* ORDER SUMMARY CARD */}

      <div className="text-xs">
        <span className="text-stone-400 uppercase tracking-widest">
          Fulfillment
        </span>
        <span className="ml-2 text-stone-700 font-medium">
          {order.fulfillmentType === "SHIPPING" ? "Shipping" : "Pickup"}
        </span>
      </div>

      <div className="rounded-xl border border-stone-100 bg-white p-5 space-y-4">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
          Items
        </p>

        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <img
                src={item.template.imageUrl}
                className="w-14 h-14 rounded-lg border border-stone-100 object-cover flex-shrink-0"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800">
                  {item.template.name}
                </p>

                <p className="text-xs text-stone-400">
                  Category: {item.template.category}
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  Wood: {item.woodTypePreference}
                </p>

                {item.finish && (
                  <p className="text-xs text-stone-500">
                    Finish: {item.finish}
                  </p>
                )}

                {item.size && (
                  <p className="text-xs text-stone-500">Size: {item.size}</p>
                )}

                {item.location && (
                  <p className="text-xs text-stone-500">
                    Location: {item.location}
                  </p>
                )}

                {item.engraving && (
                  <p className="text-xs text-stone-500">
                    Engraving: {item.engraving}
                  </p>
                )}

                {item.modificationRequest && (
                  <p className="text-xs text-stone-400 mt-1">
                    Notes: {item.modificationRequest}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="rounded-xl border border-stone-100 bg-white p-6">
        <QuoteForm order={order} />
      </div>
    </div>
  );
}
