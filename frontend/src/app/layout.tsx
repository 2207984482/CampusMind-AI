import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { Providers } from "@/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusMind AI",
  description: "AI-powered campus assistant platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
