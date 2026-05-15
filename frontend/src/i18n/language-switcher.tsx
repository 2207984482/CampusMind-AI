"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "./language-context";
import { locales } from "./types";
import type { Locale } from "./types";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = locales.find((l) => l.code === locale) ?? locales[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-ink-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-ink-800 transition-all duration-200"
        title={current.label}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{current.nativeLabel}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl border border-surface-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-soft-lg py-1 z-50 animate-scale-in origin-top-left">
          {locales.map(({ code, nativeLabel, label }) => (
            <button
              key={code}
              onClick={() => {
                setLocale(code as Locale);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 text-sm transition-colors hover:bg-surface-50 dark:hover:bg-ink-800",
                code === locale
                  ? "text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-ink-700 dark:text-surface-300"
              )}
            >
              <span>{nativeLabel}</span>
              {code === locale ? (
                <Check className="h-3.5 w-3.5 text-brand-500" />
              ) : (
                <span className="text-xs text-ink-400 dark:text-surface-500">{label}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
