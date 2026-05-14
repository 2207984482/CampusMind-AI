"use client";

import { Toaster as Sonner } from "sonner";

export function ToastProvider() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm shadow-lg",
        },
      }}
    />
  );
}
