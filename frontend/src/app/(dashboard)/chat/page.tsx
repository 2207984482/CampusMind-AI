"use client";

import { Card } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function ChatPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <h1 className="text-2xl font-bold text-ink-900 dark:text-surface-100 mb-6 tracking-tight">
        {t("chat.title")}
      </h1>

      <Card className="flex flex-col items-center justify-center py-20 text-center relative overflow-hidden" padding="lg">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/30 dark:to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center shadow-glow-sm mb-5">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-xs font-medium text-brand-600 dark:text-brand-400 mb-4">
            <Sparkles className="h-3 w-3" />
            Coming Soon
          </div>

          <h2 className="text-xl font-semibold text-ink-900 dark:text-surface-100 mb-2">
            {t("chat.comingSoon")}
          </h2>
          <p className="text-sm text-ink-500 dark:text-surface-400 max-w-md leading-relaxed">
            {t("chat.comingDesc")}
          </p>

          {/* Placeholder dots */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-brand-300 dark:bg-brand-700 animate-pulse-soft"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
