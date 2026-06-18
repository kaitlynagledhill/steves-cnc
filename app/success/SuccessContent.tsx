"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";
import { CheckCircle } from "lucide-react";

type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  fulfillmentType: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

items: {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;

  woodTypePreference: string;
  finish?: string;
  size?: string;
  location?: string;
  engraving?: string;
  modificationRequest?: string;
}[];
};

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);

  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((err) => console.error(err));
  }, [orderId]);

  if (!order) {
    return <div className="p-10 text-gray-500">{t.success.loading}</div>;
  }

  const isShipping = order.fulfillmentType === "SHIPPING";

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-8">
      {/* HEADER */}
<div className="flex items-center gap-2">
  <CheckCircle className="text-green-600" size={20} />
  <h1 className="text-2xl font-bold">{t.success.title}</h1>
        <p className="text-gray-600">
          {t.success.orderId}: <span className="font-mono">{order.id}</span>
        </p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="border rounded-lg p-4 space-y-1">
        <p>
          <span className="font-semibold">{t.success.name}:</span>{" "}
          {order.customerName}
        </p>
        <p>
          <span className="font-semibold">{t.success.email}:</span>{" "}
          {order.email}
        </p>
        <p>
          <span className="font-semibold">{t.success.phone}:</span>{" "}
          {order.phone}
        </p>
        <p>
          <span className="font-semibold">{t.success.delivery}:</span>{" "}
          {order.fulfillmentType}
        </p>
      </div>

      {/* SHIPPING ADDRESS */}
      {isShipping && (
        <div className="border rounded-lg p-4 space-y-1">
          <h2 className="font-semibold mb-2">{t.success.shippingAddress}</h2>

          <p>{order.addressLine1}</p>
          {order.addressLine2 && <p>{order.addressLine2}</p>}
          <p>
            {order.city}, {order.state} {order.zip}
          </p>
          <p>{order.country}</p>
        </div>
      )}

      {/* ITEMS */}
      <div>
        <h2 className="font-semibold mb-3">{t.success.items}</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <img
                src={item.imageUrl || "/placeholder.png"}
                className="w-24 h-24 object-cover rounded border"
              />

<div className="space-y-1">
  <p className="font-semibold">{item.name}</p>

  <DetailLine
    label="Category"
    value={item.category}
  />

  {item.woodTypePreference && (
    <DetailLine
      label="Wood"
      value={item.woodTypePreference}
    />
  )}

  {item.finish && (
    <DetailLine
      label="Finish"
      value={item.finish}
    />
  )}

  {item.size && (
    <DetailLine
      label="Size"
      value={item.size}
    />
  )}

  {item.location && (
    <DetailLine
      label="Location"
      value={item.location}
    />
  )}

  {item.engraving && (
    <DetailLine
      label="Engraving"
      value={item.engraving}
    />
  )}

  {item.modificationRequest && (
    <DetailLine
      label="Notes"
      value={item.modificationRequest}
    />
  )}
</div>
            </div>
          ))}
        </div>
      </div>

      {/* BACK BUTTON */}
<div className="flex justify-center">
  <a
    href="/"
    className="inline-block bg-black text-white px-4 py-2 rounded"
  >
    {t.success.backHome}
  </a>
</div>
    </div>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p className="text-sm">
      <span className="text-gray-400 font-medium">
        {label}:
      </span>{" "}
      <span className="text-gray-700">
        {value}
      </span>
    </p>
  );
}
