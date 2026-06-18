"use client";

import { useState } from "react";
import OrderCard from "./OrderCard";
import { OrderStatus } from "@prisma/client";

type Props = {
  orders: any[];
};

const tabs: { label: string; value: OrderStatus }[] = [
  { label: "New", value: "NEW" },
  { label: "Quote Sent", value: "QUOTE_SENT" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "CLOSED" },
];

export default function AdminTabs({ orders }: Props) {
  const [tab, setTab] = useState<OrderStatus>("NEW");

  const filteredOrders = orders.filter((order) => order.status === tab);

  const countFor = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

return (
  <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

    {/* HEADER */}
    <div className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
        Admin
      </p>

      <h1 className="font-serif text-3xl text-stone-900 tracking-tight">
        Orders
      </h1>

      <p className="text-sm text-stone-400">
        Manage customer orders and quote requests.
      </p>
    </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((t) => {
          const n = countFor(t.value);
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`
                rounded-xl border p-4 text-left transition-colors duration-200
                ${tab === t.value
                  ? "bg-stone-900 border-stone-900 text-white"
                  : "bg-white border-stone-100 hover:border-stone-200"
                }
              `}
            >
              <p className={`text-2xl font-serif ${tab === t.value ? "text-white" : "text-stone-900"}`}>
                {n}
              </p>
              <p className={`text-xs mt-0.5 ${tab === t.value ? "text-stone-300" : "text-stone-400"}`}>
                {t.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* ORDERS */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-stone-100 bg-white p-10 text-center">
            <p className="text-sm text-stone-400">No {tab.toLowerCase().replace("_", " ")} orders.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>

    </div>
  );
}
