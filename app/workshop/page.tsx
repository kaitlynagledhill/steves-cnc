"use client";

import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

export default function WorkshopPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* ── HERO ───────────────────────────── */}
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <span className="block w-8 h-px bg-stone-300" />

        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight">
          Our Workshop
        </h1>

        <p className="text-sm text-stone-500 max-w-xl leading-relaxed">
          Every piece is designed, carved, and finished in-house using CNC precision and hand finishing techniques.
        </p>
      </div>

      {/* ── OVERALL WORKSHOP ───────────────── */}
      <section className="mb-20">
        <img
          src="/workshop/ws3.jpg"
          alt="Workshop overview"
          className="w-full rounded-2xl aspect-[16/9] object-cover border border-stone-100"
        />
        <p className="text-xs text-stone-400 mt-3 text-center">
          Our CNC workshop where every design comes to life.
        </p>
      </section>

      {/* ── PROCESS SECTION ────────────────── */}
      <section className="mb-20">
        <h2 className="font-serif text-2xl text-stone-900 mb-6">
          The carving process
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {["ws2", "ws7", "ws8", "ws9"].map((img) => (
            <div key={img} className="overflow-hidden rounded-xl border border-stone-100">
              <img
                src={`/workshop/${img}.jpg`}
                alt={`Carving process ${img}`}
                className="w-full aspect-square object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-stone-500 mt-4 leading-relaxed">
          Precision CNC carving brings each design to life with consistent detail and accuracy before final hand finishing.
        </p>
      </section>

      {/* ── MATERIALS ──────────────────────── */}
      <section className="mb-20">
        <h2 className="font-serif text-2xl text-stone-900 mb-6">
          Materials & wood selection
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {["ws11", "ws12", "ws13"].map((img) => (
            <div key={img} className="overflow-hidden rounded-xl border border-stone-100">
              <img
                src={`/workshop/${img}.jpg`}
                alt={`Wood sample ${img}`}
                className="w-full aspect-square object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-stone-500 mt-4 leading-relaxed">
          We select hardwoods and CNC-ready materials for clarity of detail, durability, and a premium finished look.
        </p>
      </section>

      {/* ── FINISHED WORK ──────────────────── */}
      <section className="mb-24">
        <h2 className="font-serif text-2xl text-stone-900 mb-6">
          Finished pieces
        </h2>

        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {["ws1", "ws4", "ws5", "ws6", "ws10"].map((img) => (
            <img
              key={img}
              src={`/workshop/${img}.jpg`}
              alt={`Finished work ${img}`}
              className="w-full rounded-lg border border-stone-100 mb-3 hover:opacity-95 transition"
            />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────── */}
      <section className="text-center border-t border-stone-100 pt-16">
        <h2 className="font-serif text-3xl text-stone-900">
          Have an idea in mind?
        </h2>

        <p className="text-sm text-stone-500 mt-3 max-w-md mx-auto">
          We turn custom ideas into CNC-carved wood pieces made to order.
        </p>

        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-stone-900 text-white text-sm hover:bg-[#B07A3B] transition"
        >
          Browse designs
        </a>
      </section>

    </div>
  );
}