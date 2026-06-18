"use client";

import { OrderStatus } from "@prisma/client";
import { useState } from "react";

const FLOW: OrderStatus[] = [
  OrderStatus.NEW,
  OrderStatus.QUOTE_SENT,
  OrderStatus.IN_PROGRESS,
  OrderStatus.CLOSED,
];

function getNextStatus(status: OrderStatus): OrderStatus | null {
  const index = FLOW.indexOf(status);
  return FLOW[index + 1] ?? null;
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case OrderStatus.NEW:
      return "New Order";
    case OrderStatus.QUOTE_SENT:
      return "Quote Sent";
    case OrderStatus.IN_PROGRESS:
      return "In Progress";
    case OrderStatus.CLOSED:
      return "Completed";
    default:
      return status;
  }
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.NEW:
      return "bg-blue-600";
    case OrderStatus.QUOTE_SENT:
      return "bg-purple-600";
    case OrderStatus.IN_PROGRESS:
      return "bg-yellow-500";
    case OrderStatus.CLOSED:
      return "bg-green-600";
    default:
      return "bg-gray-400";
  }
}

export default function StatusControls({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function markComplete() {
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: OrderStatus.CLOSED,
        }),
      });

      if (!res.ok) throw new Error();

      setStatus(OrderStatus.CLOSED);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded p-5 space-y-4">
      {/* CURRENT STATUS */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="text-lg font-semibold">{getStatusLabel(status)}</p>
        </div>

        <div
          className={`px-3 py-1 text-white rounded ${getStatusColor(status)}`}
        >
          {status}
        </div>
      </div>

      {/* TIMELINE */}
      <div className="flex items-center gap-2 text-sm">
        {FLOW.map((s, idx) => {
          const isActive = FLOW.indexOf(status) >= idx;

          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive ? "bg-black" : "bg-gray-300"
                }`}
              />
              <span className={isActive ? "text-black" : "text-gray-400"}>
                {getStatusLabel(s)}
              </span>

              {idx !== FLOW.length - 1 && (
                <div className="w-6 h-px bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* ACTION */}
      <div className="pt-2">
        {status === OrderStatus.IN_PROGRESS ? (
          <button
            disabled={loading}
            onClick={markComplete}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Mark Complete
          </button>
        ) : status === OrderStatus.CLOSED ? (
          <p className="text-sm text-gray-500">Order is complete</p>
        ) : (
          <p className="text-sm text-gray-500">
            Status updates automatically through the quote workflow.
          </p>
        )}
      </div>
    </div>
  );
}
