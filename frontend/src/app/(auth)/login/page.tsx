"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/i18n";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      toast.success(t("auth.welcomeBack"));
      router.push("/chat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("auth.loginFailed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      {/* Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center shadow-glow-sm mb-4">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-surface-100 tracking-tight">
          {t("auth.signInTitle")}
        </h1>
        <p className="text-sm text-ink-500 dark:text-surface-400 mt-1.5">
          {t("auth.signInDesc")}
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label={t("common.email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label={t("common.password")}
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <Button type="submit" loading={loading} className="w-full" size="lg">
            {t("common.signIn")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-surface-400">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 font-semibold transition-colors">
            {t("common.signUp")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
