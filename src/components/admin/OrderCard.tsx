import Link from "next/link";

type OrderCardProps = {
  order: any;
};

export default function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/admin/${order.id}`}
      className="
        block rounded-xl border border-stone-200 bg-white p-5
        shadow-sm
        hover:border-stone-300 hover:shadow-md
        transition duration-200
      "
    >
      {/* TOP ROW */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-lg text-stone-900 leading-tight">
            {order.customerName || "No name"}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <DetailLine label="Email" value={order.email} />
            <span className="w-px h-3 bg-stone-200" />
            <DetailLine label="Fulfillment" value={order.fulfillmentType} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-stone-400">{date}</span>
          <span className="text-xs text-stone-400">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-4 border-t border-stone-100" />

      {/* ITEMS */}
      <div className="flex flex-col gap-3">
        {order.items.slice(0, 2).map((item: any) => (
          <div
            key={item.id}
            className="flex gap-4 p-3 rounded-lg bg-stone-100/70 border border-stone-200"          >
            <img
              src={item.template.imageUrl}
              alt={item.template.name}
              className="w-14 h-14 object-cover rounded-lg border border-stone-100 flex-shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm font-medium text-stone-800">{item.template.name}</p>
              <div className="flex flex-wrap gap-x-3">
                {item.woodTypePreference && <DetailLine label="Wood" value={item.woodTypePreference} />}
                {item.finish && <DetailLine label="Finish" value={item.finish} />}
                {item.size && <DetailLine label="Size" value={item.size} />}
                {item.location && <DetailLine label="Location" value={item.location} />}
                {item.engraving && <DetailLine label="Engraving" value={item.engraving} />}
                {item.modificationRequest && <DetailLine label="Notes" value={item.modificationRequest} />}
              </div>
            </div>
          </div>
        ))}

        {order.items.length > 2 && (
          <p className="text-xs text-stone-400 pl-1">
            +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}
          </p>
        )}
      </div>

    </Link>
  );
}

function DetailLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <p className="text-xs">
      <span className="text-stone-400">{label}: </span>
      <span className={highlight ? "text-[#B07A3B] font-medium" : "text-stone-600"}>
        {value}
      </span>
    </p>
  );
}
