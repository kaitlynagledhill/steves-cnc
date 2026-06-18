"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CATEGORIES = [
  "Australia Themed", "Bike and Bikers", "Books and Papers", "Canada",
  "Cars and Trucks", "Chessboards and Monopoly", "Christmas", "Clocks",
  "Dog Signs", "Family", "Fantasy", "Firefighters", "Fishing", "Flowers",
  "Frames", "Furniture", "Guitars", "Halloween", "Historical", "Hunting",
  "Kitchen Items", "Knives", "Movies and TV", "Ornaments", "Patriotic",
  "Plates", "Poker and Bitcoin", "Religious", "Sea and Nautical", "Signs",
  "Skulls", "Snack Plates", "Sports", "Vikings", "Wine and Beer", "Other",
];

export default function EditDesignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [design, setDesign] = useState<any>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    async function loadDesign() {
      const res = await fetch(`/api/designs/${id}`);
      const data = await res.json();
      setDesign(data);
      setName(data.name);
      setImageUrl(data.imageUrl);
      setActive(data.active ?? true);
      if (CATEGORIES.includes(data.category)) {
        setCategory(data.category);
      } else {
        setCategory("Other");
        setCustomCategory(data.category);
      }
    }
    loadDesign();
  }, [id]);

  async function save() {
    const finalCategory = category === "Other" ? customCategory.trim() : category;
    const res = await fetch(`/api/designs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category: finalCategory, imageUrl, active }),
    });

    if (!res.ok) {
      setSuccessMessage("Failed to update design.");
      return;
    }

    setSuccessMessage("Design updated successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  if (!design) {
    return (
      <div className="flex items-center justify-center min-h-64 text-stone-300 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">

      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition mb-4"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">Design</p>
        <h1 className="font-serif text-2xl text-stone-900 tracking-tight">Edit Design</h1>
      </div>

      {/* Image preview */}
      <div className="rounded-2xl overflow-hidden border border-stone-100 bg-stone-50 aspect-square">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">

        <Field label="Design name">
          <StyledInput value={name} onChange={setName} placeholder="Design name" />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full px-4 py-2.5 text-sm text-stone-800
              bg-stone-50 border border-stone-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
              transition
            "
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        {category === "Other" && (
          <Field label="Custom category">
            <StyledInput
              value={customCategory}
              onChange={setCustomCategory}
              placeholder="Enter custom category"
            />
          </Field>
        )}

        <Field label="Image URL">
          <StyledInput value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
        </Field>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50">
          <div>
            <p className="text-sm font-medium text-stone-800">Visible to customers</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {active ? "This design appears in the public catalog." : "This design is hidden from customers."}
            </p>
          </div>
          <button
            onClick={() => setActive(!active)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-medium border transition
              ${active
                ? "bg-stone-900 text-white border-stone-900"
                : "text-stone-500 border-stone-200 hover:border-stone-400"
              }
            `}
          >
            {active ? "Visible" : "Hidden"}
          </button>
        </div>

      </div>

      {/* Success message */}
      {successMessage && (
        <div className="px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-sm">
          ✓ {successMessage}
        </div>
      )}

      {/* Save */}
      <button
        onClick={save}
        className="
          w-full py-3 rounded-xl text-sm font-medium
          bg-stone-900 text-white
          hover:bg-[#B07A3B] transition-colors duration-200
        "
      >
        Save changes
      </button>

    </div>
  );
}

/* ── Sub-components ─────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function StyledInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
