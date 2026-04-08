import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "bn" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (bn: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "bn",
  toggleLang: () => {},
  t: (bn) => bn,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("artemis-lang") as Lang) || "bn";
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "bn" ? "en" : "bn";
      localStorage.setItem("artemis-lang", next);
      return next;
    });
  };

  const t = (bn: string, en: string) => (lang === "bn" ? bn : en);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
