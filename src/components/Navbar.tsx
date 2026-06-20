"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ShoppingCart } from "lucide-react";

import { useCartCount } from "@/src/lib/useCartCount";
import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

import Logo from "@/src/components/Logo";

export default function Navbar() {
  const count = useCartCount();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/login");

  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* BRAND */}
        <Link href="/" className="flex items-center">
          <div className="scale-110 md:scale-125">
            <Logo />
          </div>
        </Link>

        {/* RIGHT SIDE */}
        {!isAdmin && !isAuthPage && (
          <div className="flex items-center gap-5">

            {/* ABOUT */}
            <Link
              href="/about"
              className="hidden md:inline-flex text-sm text-stone-500 hover:text-stone-900 transition px-2"
            >
              {t.aboutPage.title}
            </Link>

            {/* WORKSHOP */}
            <Link
              href="/workshop"
              className="hidden md:inline-flex text-sm text-stone-500 hover:text-stone-900 transition px-2"
            >
              {t.workshop}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-stone-100 transition"
            >
              <ShoppingCart size={20} strokeWidth={1.8} className="text-stone-700" />

              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 rounded-full bg-[#B07A3B] text-white text-[11px] font-medium px-1">
                  {count}
                </span>
              )}
            </Link>

            {/* LANGUAGE */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition"
              >
                {lang === "en" ? "English" : "Español"}
                <ChevronDown
                  size={14}
                  className={`transition ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-36 rounded-xl border border-stone-100 bg-white shadow-lg overflow-hidden">
                  <button
                    onClick={() => { setLang("en"); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition"
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLang("es"); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition"
                  >
                    Español
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

            {/* MOBILE NAV (ADD THIS HERE) */}
      {!isAdmin && !isAuthPage && (
        <div className="md:hidden border-t border-stone-100">
          <div className="flex justify-center gap-8 py-2 text-sm text-stone-600">

            <Link href="/about" className="hover:text-stone-900 transition">
              {t.aboutPage.title}
            </Link>

            <Link href="/workshop" className="hover:text-stone-900 transition">
              {t.workshop}
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
