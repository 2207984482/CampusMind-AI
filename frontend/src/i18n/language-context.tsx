"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { locales as localeDefs, defaultLocale } from "./types";
import type { Locale } from "./types";
import zh from "./zh.json";
import en from "./en.json";
import ja from "./ja.json";
import ko from "./ko.json";
import fr from "./fr.json";
import es from "./es.json";

const messages: Record<Locale, Record<string, unknown>> = { zh, en, ja, ko, fr, es };
const localeCodes: Locale[] = ["zh", "en", "ja", "ko", "fr", "es"];

type NestedKeyOf<T> = T extends string
  ? never
  : { [K in keyof T & string]: T[K] extends Record<string, unknown>
      ? `${K}.${NestedKeyOf<T[K]>}`
      : K
    }[keyof T & string];

type TranslationKey = NestedKeyOf<typeof zh>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem("campusmind-locale") as Locale | null;
    if (stored && localeCodes.includes(stored)) {
      setLocaleState(stored);
    } else {
      const browserLang = navigator.language.split("-")[0];
      const matched = localeDefs.find((l) => l.code.startsWith(browserLang));
      if (matched) setLocaleState(matched.code);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("campusmind-locale", newLocale);
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let value = getNestedValue(messages[locale] as Record<string, unknown>, key);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, v);
        }
      }
      return value;
    },
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
