"use client";

import { useEffect, useState } from "react";
import { getCart, CartItem } from "@/src/lib/cart";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    setItems(getCart());
  }, []);

  function handleRemove(id: string) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("vala_cart", JSON.stringify(updated));
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <span className="block w-8 h-px bg-stone-300 mb-4" />

        <h1 className="font-serif text-3xl text-stone-900 tracking-tight">
          {t.cart.title}
        </h1>

        <p className="mt-2 text-sm text-stone-400 max-w-sm leading-relaxed">
          {t.cart.subtitle}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-stone-400 text-sm">
            {t.cart.empty}
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 text-sm rounded-full bg-stone-900 text-white hover:bg-stone-700 transition"
          >
            {t.cart.browse}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-stone-100 bg-stone-50"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p className="text-sm font-medium text-stone-800">
                    {item.name}
                  </p>

                  <DetailLine label={t.cart.category} value={item.category} />

                  {item.woodType && (
                    <DetailLine label={t.cart.wood} value={item.woodType} />
                  )}

                  {item.finish && (
                    <DetailLine label={t.cart.finish} value={item.finish} />
                  )}

                  {item.size && (
                    <DetailLine label={t.cart.size} value={item.size} />
                  )}

                  {item.location && (
                    <DetailLine label={t.cart.location} value={item.location} />
                  )}

                  {item.engraving && (
                    <DetailLine label={t.cart.engraving} value={item.engraving} />
                  )}

                  {item.modificationRequest && (
                    <DetailLine label={t.cart.notes} value={item.modificationRequest} />
                  )}
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-stone-400 hover:text-red-400 transition self-start flex-shrink-0"
                >
                  {t.cart.remove}
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
              <span>
                {items.length} {t.cart.summaryItems}
              </span>

              <span className="text-xs text-stone-400">
                {t.cart.depositNote}
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-[#B07A3B] transition-colors duration-200"
            >
              {t.cart.checkout}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-2 text-xs text-stone-400 hover:text-stone-600 transition"
            >
              {t.cart.continue}
            </button>
          </div>
        </>
      )}
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
    <div className="text-xs leading-relaxed">
      <span className="text-stone-400 font-medium">{label}:</span>
      <span className="text-stone-700 ml-1">{value}</span>
    </div>
  );
}