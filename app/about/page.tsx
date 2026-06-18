"use client";

import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";
import Link from "next/link";

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">

      {/* HEADER */}
      <div className="flex flex-col items-center text-center gap-4">
        <span className="block w-8 h-px bg-stone-300" />
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight">
          {t.aboutPage.title}
        </h1>
        <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
          {t.howItWorks.subtitle}
        </p>
      </div>

      {/* STEVE SECTION */}
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* IMAGE — portrait ratio, not square */}
        <div className="rounded-2xl overflow-hidden border border-stone-100 bg-stone-50 aspect-[3/4] max-w-xs mx-auto w-full">
          <img
            src="/steve.jpg"
            alt="Steve working in the CNC workshop"
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-2">
              The maker
            </p>
            <h2 className="font-serif text-2xl text-stone-900">Built by Steve</h2>
          </div>

          <div className="flex flex-col gap-4 text-sm text-stone-600 leading-relaxed">
            <p>{t.aboutPage.story1}</p>
            <p>{t.aboutPage.story2}</p>
            <p>{t.aboutPage.story3}</p>
          </div>

          <p className="text-xs text-stone-400 border-t border-stone-100 pt-4">
            Every piece is designed and carved in-house, made to order.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="flex flex-col gap-12">

        <div className="flex flex-col items-center text-center gap-3">
          <span className="block w-6 h-px bg-[#B07A3B]" />
          <h2 className="font-serif text-3xl text-stone-900 tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps — horizontal line connecting them on desktop */}
        <div className="grid md:grid-cols-4 gap-8 relative">

          {/* Connecting rule — desktop only */}
          <div className="hidden md:block absolute top-4 left-[12.5%] right-[12.5%] h-px bg-stone-100 z-0" />

          {[
            { n: "1", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
            { n: "2", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
            { n: "3", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
            { n: "4", title: t.howItWorks.step4Title, desc: t.howItWorks.step4Desc },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-3 items-start md:items-center md:text-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-medium text-stone-500 flex-shrink-0">
                {step.n}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-stone-800">{step.title}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit callout */}
        <div className="rounded-xl border border-stone-100 bg-stone-50 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-800">$25 design deposit</p>
            <p className="text-xs text-stone-400 mt-0.5 leading-relaxed max-w-sm">
              Every quote starts with a $25 deposit that covers Steve's time designing your piece.
              If you approve the quote, it goes toward your final balance.
            </p>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium bg-stone-900 text-white hover:bg-[#B07A3B] transition-colors duration-200"
          >
            {t.howItWorks.cta}
          </Link>
        </div>

      </div>

    </div>
  );
}
