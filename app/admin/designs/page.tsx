"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  active: boolean;
};

export default function DesignsAdminPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [search, setSearch] = useState("");

  const filteredDesigns = designs.filter((design) => {
    const query = search.toLowerCase();

    const matchesSearch =
      design.name.toLowerCase().includes(query) ||
      design.category.toLowerCase().includes(query);

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? design.active
          : !design.active;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetch(`/api/designs?status=${filter}`)
      .then((res) => res.json())
      .then(setDesigns);
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
          Admin
        </p>

        <h1 className="font-serif text-3xl text-stone-900 tracking-tight">
          Carving Designs
        </h1>

        <p className="text-sm text-stone-400 mt-2">
          Manage available CNC templates and customer-facing designs.
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designs..."
            className="
        w-full pl-8 pr-4 py-2 text-sm text-stone-800
        bg-stone-50 border border-stone-200 rounded-full
        placeholder:text-stone-300
        focus:outline-none focus:ring-2 focus:ring-stone-900/8 focus:border-stone-300
        transition
      "
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2">
        {["active", "inactive", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "active" | "inactive" | "all")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium
              border transition-colors duration-200

              ${
                filter === f
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-500 border-stone-100 hover:border-stone-200 hover:text-stone-700"
              }
            `}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* GRID */}
      {filteredDesigns.length === 0 ? (
        <div
          className="
            rounded-xl border border-stone-100
            bg-white p-8 text-center
          "
        >
          <p className="text-sm text-stone-400">No designs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredDesigns.map((d) => (
            <Link
              key={d.id}
              href={`/admin/designs/${d.id}`}
              className={`
                group rounded-xl border border-stone-100
                bg-white p-4
                hover:border-stone-200
                transition-colors duration-200

                ${!d.active ? "opacity-60" : ""}
              `}
            >
              <div className="relative">
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="
                    w-full h-48 object-cover
                    rounded-lg border border-stone-100
                  "
                />

                {!d.active && (
                  <span
                    className="
                      absolute top-2 right-2
                      text-xs uppercase tracking-wide
                      bg-stone-900 text-white
                      px-2 py-1 rounded-full
                    "
                  >
                    Inactive
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-stone-800">{d.name}</p>

                <p className="text-xs text-stone-400 mt-1">{d.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
