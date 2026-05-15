"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-ink-950">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-200/20 to-transparent dark:from-brand-900/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-200/15 to-transparent dark:from-accent-900/8 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-ink-900 dark:text-surface-100 tracking-tight">
            CampusMind
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
