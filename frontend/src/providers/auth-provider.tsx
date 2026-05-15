"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import { LanguageProvider } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
