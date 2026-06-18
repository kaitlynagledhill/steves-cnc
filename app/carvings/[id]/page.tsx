"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addToCart } from "@/src/lib/cart";
import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

const WOOD_TYPES = [
  "Walnut", "Cherry", "Maple", "Other / Not sure",
];

const FINISHES = [
  "Natural (unfinished)", "Clear satin", "Dark stain", "Light stain", "Painted", "Other / Not sure",
];

export default function CarvingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [design, setDesign] = useState<Design | null>(null);
  const [note, setNote] = useState("");
  const [woodType, setWoodType] = useState("");
  const [finish, setFinish] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [engraving, setEngraving] = useState("");
  const [added, setAdded] = useState(false);

  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/designs/${id}`);
        if (!res.ok) { setDesign(null); return; }
        setDesign(await res.json());
      } catch { setDesign(null); }
    };
    load();
  }, [id]);

  if (!design && id) {
    return (
      <div className="flex items-center justify-center min-h-64 text-stone-300 text-sm">
        Loading...
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex items-center justify-center min-h-64 text-stone-400 text-sm">
        Design not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition mb-8"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {t.carvingDetail.back}
      </button>

      <div className="grid md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="flex flex-col gap-3 ">
          <div className="aspect-square rounded-2xl overflow-hidden border border-stone-100 bg-stone-50">
            <img
              src={design.imageUrl}
              alt={design.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-stone-400 leading-relaxed text-center">
            {t.carvingDetail.depositNote}
          </p>
        </div>

        {/* FORM SIDE */}
        <div className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              {design.category}
            </p>
            <h1 className="font-serif text-3xl text-stone-900 tracking-tight">
              {design.name}
            </h1>
          </div>

          <div className="border-t border-stone-100" />

          {/* Wood type */}
          <Field label={t.carvingDetail.woodType}>
            <div className="flex flex-wrap gap-2">
              {WOOD_TYPES.map((w) => (
                <Chip
                  key={w}
                  label={w}
                  active={woodType === w}
                  onClick={() => setWoodType(w)}
                />
              ))}
            </div>
          </Field>

          {/* Finish */}
          <Field label={t.carvingDetail.finish}>
            <div className="flex flex-wrap gap-2">
              {FINISHES.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  active={finish === f}
                  onClick={() => setFinish(f)}
                />
              ))}
            </div>
          </Field>

          {/* Size */}
          <Field
            label={t.carvingDetail.size}
            hint={t.carvingDetail.sizeHint}
          >
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder={t.carvingDetail.sizePlaceholder}
              className="
                w-full px-4 py-2.5 text-sm text-stone-800
                bg-stone-50 border border-stone-200 rounded-xl
                placeholder:text-stone-300
                focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
                transition
              "
            />
          </Field>

          {/* Engraving */}
          <Field
            label={t.carvingDetail.engraving}
            hint={t.carvingDetail.engravingPlaceholder}
          >
            <input
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder={t.carvingDetail.engravingPlaceholder}
              className="
                w-full px-4 py-2.5 text-sm text-stone-800
                bg-stone-50 border border-stone-200 rounded-xl
                placeholder:text-stone-300
                focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
                transition
              "
            />
          </Field>

          {/* Notes */}
          <Field
            label={t.carvingDetail.anythingElse}
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.carvingDetail.notesPlaceholder}
              rows={3}
              className="
                w-full px-4 py-2.5 text-sm text-stone-800
                bg-stone-50 border border-stone-200 rounded-xl
                placeholder:text-stone-300
                focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
                transition resize-none
              "
            />
          </Field>

          {/* CTA */}
          <div className="flex flex-col gap-2 pt-1">

            {added && (
              <p className="text-sm text-center text-[#B07A3B] font-medium">
                {t.carvingDetail.addedToCart}
              </p>
            )}

            <button
              onClick={() => {
                addToCart({
                  id: crypto.randomUUID(),
                  templateId: design.id,
                  name: design.name,
                  imageUrl: design.imageUrl,
                  category: design.category,

                  woodType,
                  finish,
                  size,
                  location,
                  engraving,
                  modificationRequest: note,
                });

                setAdded(true);
                setTimeout(() => setAdded(false), 3000);
              }}
              className="
                w-full py-3 rounded-xl
                bg-stone-900 text-white text-sm font-medium
                hover:bg-[#B07A3B] transition-colors duration-200
              "
            >
              {t.addToCart}
            </button>

            <p className="text-xs text-stone-400 text-center">
              {t.carvingDetail.depositNote}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────── */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-xs border transition
        ${
          active
            ? "bg-stone-900 text-white border-stone-900"
            : "text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800"
        }
      `}
    >
      {label}
    </button>
  );
}