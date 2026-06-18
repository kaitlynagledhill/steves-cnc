"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuoteForm({ order }: any) {
  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const isShipping = order.fulfillmentType === "SHIPPING";

  async function submit() {
    setLoading(true);

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        totalPrice: Number(totalPrice),
        shippingCost: isShipping ? Number(shippingCost) : null,
        estimatedDays,
        notes,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to create quote");
      return;
    }

    router.push(`/admin/${order.id}`);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-stone-100 bg-white p-5 space-y-4">
      <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
        Quote details
      </p>

      {/* Total price */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-stone-600 uppercase tracking-widest">
          {" "}
          Total price
        </label>
        <input
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
          className="w-full rounded-lg border border-stone-100 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
        />
      </div>

      {/* Shipping */}
      {isShipping && (
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-stone-600 uppercase tracking-widest">
            {" "}
            Shipping cost
          </label>
          <input
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="w-full rounded-lg border border-stone-100 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
          />
        </div>
      )}

      {/* Estimated days */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-stone-600 uppercase tracking-widest">
          {" "}
          Estimated time
        </label>
        <input
          value={estimatedDays}
          onChange={(e) => setEstimatedDays(e.target.value)}
          className="w-full rounded-lg border border-stone-100 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-stone-600 uppercase tracking-widest">
          {" "}
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-stone-100 px-3 py-2 text-sm text-stone-800 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-stone-900/10"
        />
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading}
        className="
          w-full rounded-lg py-2.5 text-sm font-medium
          bg-stone-900 text-white
          hover:bg-[#B07A3B]
          transition
        "
      >
        {loading ? "Sending..." : "Send quote"}
      </button>
    </div>
  );
}
