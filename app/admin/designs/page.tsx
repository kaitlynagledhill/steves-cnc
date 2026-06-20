"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  active: boolean;
};

const PAGE_SIZE = 21;

function getCloudinaryUrl(url: string, width: number) {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

export default function DesignsAdminPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    fetch(`/api/designs?status=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        setDesigns(data);
        setLoading(false);
      });
  }, [filter]);

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  const filteredDesigns = designs.filter((design) => {
    const query = search.toLowerCase();
    return (
      design.name.toLowerCase().includes(query) ||
      design.category.toLowerCase().includes(query)
    );
  });

  const visibleDesigns = filteredDesigns.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDesigns.length;

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

      {/* SEARCH + FILTER ROW */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
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
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition"
              aria-label="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {(["active", "inactive", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium
                border transition-colors duration-200
                ${filter === f
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-500 border-stone-100 hover:border-stone-200 hover:text-stone-700"
                }
              `}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT COUNT */}
      {!loading && (
        <p className="text-xs text-stone-400 -mt-4">
          {filteredDesigns.length} design{filteredDesigns.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-stone-300 text-sm tracking-wide">
          Loading...
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="rounded-xl border border-stone-100 bg-white p-8 text-center">
          <p className="text-sm text-stone-400">
            {search ? `No designs found for "${search}".` : "No designs found."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-stone-400 hover:text-stone-700 underline underline-offset-2 transition"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visibleDesigns.map((d) => (
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
                    src={getCloudinaryUrl(d.imageUrl, 600)}
                    srcSet={`
                      ${getCloudinaryUrl(d.imageUrl, 400)} 400w,
                      ${getCloudinaryUrl(d.imageUrl, 600)} 600w,
                      ${getCloudinaryUrl(d.imageUrl, 800)} 800w
                    `}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={d.name}
                    className="w-full h-48 object-cover rounded-lg border border-stone-100"
                  />
                  {!d.active && (
                    <span className="absolute top-2 right-2 text-xs uppercase tracking-wide bg-stone-900 text-white px-2 py-1 rounded-full">
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

          {hasMore && (
            <div className="pt-4">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="
                  w-full py-2.5 rounded-xl border border-stone-200
                  text-sm text-stone-500
                  hover:border-stone-300 hover:text-stone-700
                  transition
                "
              >
                Load more · {filteredDesigns.length - visibleCount} remaining
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
