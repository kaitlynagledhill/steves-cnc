"use client";

import { useLanguage } from "@/src/lib/language-context";
import { translations } from "@/src/lib/translations";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <footer className="border-t border-stone-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="block w-6 h-px bg-[#B07A3B]" />
            <p className="font-serif text-lg text-stone-800">
              Steve's CNC
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
              {t.footer.contact}
            </p>

            <a
              href="https://wa.me/17202728804"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#B07A3B] transition group w-fit"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-stone-400 group-hover:text-[#B07A3B] transition"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.83L.057 23.998l6.306-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.979 1-3.64-.234-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>

              {t.footer.whatsappLabel}
            </a>

            <p className="text-xs text-stone-400">
              {t.footer.orderHelp}
            </p>
          </div>

          {/* Policies */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
              {t.footer.policies}
            </p>

            <div className="flex flex-col gap-2">
              <PolicyLine
                label={t.footer.designDepositLabel}
                detail={t.footer.designDepositDetail}
              />
              <PolicyLine
                label={t.footer.shippingLabel}
                detail={t.footer.shippingDetail}
              />
              <PolicyLine
                label={t.footer.refundsLabel}
                detail={t.footer.refundsDetail}
              />
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-400">
            © {currentYear} Steve's CNC · {t.footer.rights}
          </p>

          <p className="text-xs text-stone-400">
            {t.footer.builtBy}{" "}
            <a
              href="https://www.linkedin.com/in/kaitlyn-gledhill"
              className="text-stone-500 hover:text-[#B07A3B] transition underline underline-offset-2"
            >
              Kaitlyn Gledhill
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}

function PolicyLine({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) {
  return (
    <div>
      <p className="text-sm text-stone-600 font-medium">{label}</p>
      <p className="text-xs text-stone-400 leading-relaxed mt-0.5">
        {detail}
      </p>
    </div>
  );
}