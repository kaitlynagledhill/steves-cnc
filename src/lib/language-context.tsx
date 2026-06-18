"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "es";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
