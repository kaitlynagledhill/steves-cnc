"use client";

import { useState, useEffect } from "react";
import { getCart, clearCart, CartItem } from "@/src/lib/cart";
import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<"SHIPPING" | "PICKUP">("SHIPPING");
  const [pickupLocation, setPickupLocation] = useState<"RENO" | "MEXICO">("RENO");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.en;

  useEffect(() => { setItems(getCart()); }, []);

  async function submitOrder() {
    setError(null);
    if (!name || !email || !phone) { setError(t.checkout.errors.contactInfo); return; }
    if (items.length === 0) { setError(t.checkout.errors.emptyCart); return; }
    if (fulfillmentType === "SHIPPING" && (!address1 || !city || !state || !zip)) {
      setError(t.checkout.errors.shippingAddress); return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name, email, phone, fulfillmentType,
          pickupLocation: fulfillmentType === "PICKUP" ? pickupLocation : null,
          addressLine1: address1, addressLine2: address2, city, state, zip,
          items: items.map((item) => ({
            templateId: item.templateId,
            quantity: 1,
            woodTypePreference: item.woodType,
            modificationRequest: item.modificationRequest,
            imageUrl: item.imageUrl,
            finish: item.finish,
            size: item.size,
            location: item.location,
            engraving: item.engraving,
          })),
        }),
      });

      if (!res.ok) { setError(t.checkout.errors.orderFailed); return; }

      const data = await res.json();
      clearCart();

      const ENABLE_PAYMENTS = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true";
      if (!ENABLE_PAYMENTS) { window.location.href = `/success?orderId=${data.orderId}`; return; }

      const stripeRes = await fetch("/api/stripe/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });

      const stripeData = await stripeRes.json();
      if (stripeData.url) { window.location.href = stripeData.url; }
      else { setError(t.checkout.errors.paymentFailed); }
    } catch {
      setError(t.checkout.errors.generic);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <span className="block w-8 h-px bg-stone-300 mb-4" />
        <h1 className="font-serif text-3xl text-stone-900 tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="mt-2 text-sm text-stone-400 max-w-sm leading-relaxed">
          Review your selections below. A $25 design deposit is collected at submission — credited toward your order.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-8">

        {/* ORDER SUMMARY */}
        <Section title="Your quote request">
          {items.length === 0 ? (
            <p className="text-sm text-stone-400">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-stone-100 bg-stone-50">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{item.name}</p>
                    <p className="text-xs text-stone-400">{item.category}</p>
                    {item.woodType && <DetailLine label="Wood" value={item.woodType} />}
                    {item.finish && <DetailLine label="Finish" value={item.finish} />}
                    {item.size && <DetailLine label="Size" value={item.size} />}
                    {item.location && <DetailLine label="Location" value={item.location} />}
                    {item.engraving && <DetailLine label="Engraving" value={item.engraving} />}
                    {item.modificationRequest && <DetailLine label="Notes" value={item.modificationRequest} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="border-t border-stone-100" />

        {/* CONTACT */}
        <Section title={t.checkout.customerInfo}>
          <div className="flex flex-col gap-3">
            <StyledInput placeholder={t.checkout.fullName} value={name} onChange={setName} />
            <StyledInput placeholder={t.checkout.email} value={email} onChange={setEmail} type="email" />
            <StyledInput placeholder={t.checkout.phone} value={phone} onChange={setPhone} type="tel" />
          </div>
        </Section>

        <div className="border-t border-stone-100" />

        {/* FULFILLMENT */}
        <Section title={t.checkout.deliveryMethod}>
          <div className="flex gap-4">
            <RadioCard
              label={t.checkout.shipping}
              checked={fulfillmentType === "SHIPPING"}
              onChange={() => setFulfillmentType("SHIPPING")}
            />
            <RadioCard
              label={t.checkout.pickup.label}
              checked={fulfillmentType === "PICKUP"}
              onChange={() => setFulfillmentType("PICKUP")}
            />
          </div>

          {fulfillmentType === "PICKUP" && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-stone-700">{t.checkout.pickup.title}</p>
              <div className="flex gap-4">
                <RadioCard
                  label={t.checkout.pickup.reno}
                  checked={pickupLocation === "RENO"}
                  onChange={() => setPickupLocation("RENO")}
                />
                <RadioCard
                  label={t.checkout.pickup.mexico}
                  checked={pickupLocation === "MEXICO"}
                  onChange={() => setPickupLocation("MEXICO")}
                />
              </div>
              <p className="text-xs text-stone-400">{t.checkout.pickup.description}</p>
            </div>
          )}
        </Section>

        {/* SHIPPING ADDRESS */}
        {fulfillmentType === "SHIPPING" && (
          <>
            <div className="border-t border-stone-100" />
            <Section title={t.checkout.shippingAddress}>
              <div className="flex flex-col gap-3">
                <StyledInput placeholder={t.checkout.address1} value={address1} onChange={setAddress1} />
                <StyledInput placeholder={t.checkout.address2} value={address2} onChange={setAddress2} />
                <div className="grid grid-cols-3 gap-3">
                  <StyledInput placeholder={t.checkout.city} value={city} onChange={setCity} />
                  <StyledInput placeholder={t.checkout.state} value={state} onChange={setState} />
                  <StyledInput placeholder={t.checkout.zip} value={zip} onChange={setZip} />
                </div>
              </div>
            </Section>
          </>
        )}

        {/* SUBMIT */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={submitOrder}
            className="
              w-full py-3 rounded-xl
              bg-stone-900 text-white text-sm font-medium
              hover:bg-[#B07A3B] transition-colors duration-200
            "
          >
            {t.checkout.submit}
          </button>
          <p className="text-xs text-stone-400 text-center">
            $25 design deposit collected at next step — credited toward your order
          </p>
        </div>

      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">{title}</p>
      {children}
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-xs text-stone-500">
      <span className="text-stone-400">{label}: </span>{value}
    </p>
  );
}

function StyledInput({
  placeholder, value, onChange, type = "text",
}: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full px-4 py-2.5 text-sm text-stone-800
        bg-stone-50 border border-stone-200 rounded-xl
        placeholder:text-stone-300
        focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
        transition
      "
    />
  );
}

function RadioCard({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`
        flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm transition flex-1
        ${checked
          ? "bg-stone-900 text-white border-stone-900"
          : "text-stone-600 border-stone-200 hover:border-stone-400"
        }
      `}
    >
      <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
        checked ? "border-white bg-white" : "border-stone-300"
      }`} />
      {label}
    </button>
  );
}
