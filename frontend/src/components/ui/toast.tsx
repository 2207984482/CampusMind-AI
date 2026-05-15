"use client";

import { Toaster as Sonner } from "sonner";

export function ToastProvider() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "rounded-xl border border-surface-200 dark:border-ink-800 bg-white/90 dark:bg-ink-900/90 backdrop-blur-lg text-sm shadow-soft-lg",
          title: "text-ink-900 dark:text-surface-100 font-medium text-sm",
          description: "text-ink-500 dark:text-surface-400 text-xs",
          success: "border-l-[3px] border-l-emerald-500",
          error: "border-l-[3px] border-l-red-500",
          info: "border-l-[3px] border-l-brand-500",
          warning: "border-l-[3px] border-l-accent-500",
        },
      }}
    />
  );
}
