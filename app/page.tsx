"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { translations } from "@/src/lib/translations";
import { useLanguage } from "@/src/lib/language-context";
import Fuse from "fuse.js";
import DesignCard from "@/src/components/DesignCard";

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isCategoryCover?: boolean;
};

const PAGE_SIZE = 21;

function useDebounce(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { lang } = useLanguage();
  const t = translations[lang];
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/designs")
      .then((r) => r.json())
      .then((data) => {
        setDesigns(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, debouncedSearch, showFavoritesOnly]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showMobileCategories) return;
    const handler = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMobileCategories(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMobileCategories]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const shuffledDesigns = useMemo(
    () => seededShuffle(designs, sessionSeed),
    [designs, sessionSeed],
  );

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    designs.forEach((d) => map.set(d.category, (map.get(d.category) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [designs]);

  const fuse = useMemo(
    () =>
      new Fuse(shuffledDesigns, {
        keys: ["name", "category"],
        threshold: 0.35,
      }),
    [shuffledDesigns],
  );

  const filteredDesigns = useMemo(() => {
    let results = shuffledDesigns;
    if (showFavoritesOnly)
      results = results.filter((d) => favorites.includes(d.id));
    if (selectedCategory)
      results = results.filter((d) => d.category === selectedCategory);
    if (debouncedSearch.trim()) {
      const ids = new Set(fuse.search(debouncedSearch).map((r) => r.item.id));
      results = results.filter((d) => ids.has(d.id));
    }
    return results;
  }, [
    shuffledDesigns,
    favorites,
    showFavoritesOnly,
    selectedCategory,
    debouncedSearch,
    fuse,
  ]);

  const visibleDesigns = filteredDesigns.slice(0, visibleCount);
  const noResults = filteredDesigns.length === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-stone-300 text-sm tracking-wide">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <header className="border-b border-stone-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 flex flex-col items-center text-center gap-4">
          <span className="block w-8 h-px bg-[#B07A3B]" />

          <div className="flex flex-col items-center gap-2">
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-tight">
              {t.hero.title}
            </h1>
            <p className="mt-1 font-serif italic text-stone-400 text-base md:text-lg leading-snug">
              {t.hero.subtitle}
            </p>
            <p className="text-stone-500 text-sm leading-relaxed max-w-2xl">
              {t.hero.description}
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-5 text-xs text-stone-400 tracking-wide">
            <span className="tabular-nums">{designs.length} designs</span>
            <span className="w-px h-3 bg-stone-200" />
            <span>{categories.length} categories</span>
            <span className="w-px h-3 bg-stone-200" />
            <span>Made to order</span>
          </div>

          {/* Search + Saved row */}
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

            {/* Saved pill button */}
            <button
              onClick={() => {
                setShowFavoritesOnly((v) => !v);
                setSelectedCategory("");
              }}
              title={showFavoritesOnly ? "Show all" : "View saved"}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium
                border transition
                ${
                  showFavoritesOnly
                    ? "bg-[#B07A3B] border-[#B07A3B] text-white"
                    : "text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800"
                }
              `}
            >
              <Heart
                size={12}
                className={
                  showFavoritesOnly
                    ? "fill-white stroke-white"
                    : "stroke-stone-400"
                }
              />
              <span>
                Saved {favorites.length > 0 && `· ${favorites.length}`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">

        {/* MOBILE category dropdown — outside the flex row */}
        {!showFavoritesOnly && (
          <div className="md:hidden mb-5 relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setShowMobileCategories((v) => !v)}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 font-medium shadow-sm"
            >
              <span>{selectedCategory || "All Designs"}</span>
              <svg
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${showMobileCategories ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showMobileCategories && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-stone-200 bg-white shadow-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setShowMobileCategories(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition
                    ${!selectedCategory
                      ? "bg-stone-50 text-[#B07A3B] font-medium"
                      : "text-stone-600 hover:bg-stone-50"
                    }`}
                >
                  All Designs
                </button>
                <div className="border-t border-stone-100" />
                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setShowMobileCategories(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex justify-between items-center transition
                      ${selectedCategory === c.name
                        ? "bg-stone-50 text-[#B07A3B] font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                      }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-stone-400 tabular-nums">{c.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`flex flex-col md:flex-row min-w-0 ${showFavoritesOnly ? "" : "md:gap-10"}`}
        >
          {/* SIDEBAR — desktop only */}
          <aside
            className={`w-56 flex-shrink-0 ${showFavoritesOnly ? "hidden" : "hidden md:block"}`}
          >
            <nav className="sticky top-6 flex flex-col gap-0.5">
              <SidebarItem
                label={t.allDesigns}
                active={!selectedCategory && !showFavoritesOnly}
                onClick={() => {
                  setSelectedCategory("");
                  setShowFavoritesOnly(false);
                }}
              />

              <div className="my-3 border-t border-stone-100" />

              <p className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                Category
              </p>

              {categories.map((c) => (
                <SidebarItem
                  key={c.name}
                  label={c.name}
                  count={c.count}
                  active={selectedCategory === c.name && !showFavoritesOnly}
                  onClick={() => {
                    setSelectedCategory(c.name);
                    setShowFavoritesOnly(false);
                  }}
                />
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <main className="flex-1 min-w-0">
            {showFavoritesOnly && (
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-stone-700 font-medium">
                  Saved designs · {filteredDesigns.length}
                </span>
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="text-xs text-stone-400 hover:text-stone-700 transition underline underline-offset-2"
                >
                  ← Back to all
                </button>
              </div>
            )}

            {/* Active filter context */}
            {(selectedCategory || showFavoritesOnly || debouncedSearch) && (
              <div className="mb-5 flex items-center gap-2">
                <span className="text-stone-300 text-sm">
                  · {filteredDesigns.length}
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setShowFavoritesOnly(false);
                    setSearch("");
                  }}
                  className="ml-auto text-xs text-stone-400 hover:text-stone-700 transition underline underline-offset-2"
                >
                  Clear
                </button>
              </div>
            )}

            {noResults ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                {showFavoritesOnly && (
                  <Heart size={32} strokeWidth={1.2} className="text-stone-200" />
                )}
                <p className="text-stone-400 text-sm">
                  {showFavoritesOnly
                    ? "Nothing saved yet — tap the heart on any design."
                    : debouncedSearch
                      ? `No results for "${debouncedSearch}".`
                      : "No designs to display."}
                </p>
                {showFavoritesOnly && (
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="px-5 py-2 text-sm rounded-full bg-stone-900 text-white hover:bg-stone-700 transition"
                  >
                    Browse all
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {visibleDesigns.map((d) => (
                  <DesignCard
                    key={d.id}
                    design={d}
                    isFavorited={favorites.includes(d.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}

            {visibleCount < filteredDesigns.length && (
              <div className="pt-8">
                <button
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="
                    w-full py-2.5 rounded-xl border border-stone-200
                    text-sm text-stone-500
                    hover:border-stone-300 hover:text-stone-700
                    transition
                  "
                >
                  {t.loadMore}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Link
        href="/admin"
        aria-hidden="true"
        tabIndex={-1}
        className="fixed bottom-0 right-0 w-10 h-10"
      />
    </>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function SidebarItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between w-full
        px-3 py-1.5 rounded-lg text-left text-sm transition-colors
        ${
          active
            ? "text-[#B07A3B] font-medium"
            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        }
      `}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs ml-2 flex-shrink-0 tabular-nums
          ${active ? "text-stone-500" : "text-stone-400"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
