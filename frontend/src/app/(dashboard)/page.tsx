"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare, BookOpen, Bot, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const shortcuts = [
    {
      href: "/chat",
      label: t("dashboard.aiChat"),
      desc: t("dashboard.aiChatDesc"),
      icon: MessageSquare,
      gradient: "from-brand-500 to-brand-600",
      bgGradient: "from-brand-50 to-brand-100 dark:from-brand-950/50 dark:to-brand-900/30",
      glow: "group-hover:shadow-brand-500/10",
    },
    {
      href: "/knowledge",
      label: t("dashboard.knowledgeBase"),
      desc: t("dashboard.knowledgeBaseDesc"),
      icon: BookOpen,
      gradient: "from-accent-500 to-accent-600",
      bgGradient: "from-accent-50 to-accent-100 dark:from-accent-950/50 dark:to-accent-900/30",
      glow: "group-hover:shadow-accent-500/10",
    },
    {
      href: "/agents",
      label: t("dashboard.customAgents"),
      desc: t("dashboard.customAgentsDesc"),
      icon: Bot,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
      glow: "group-hover:shadow-emerald-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10 animate-fade-down">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-surface-100 tracking-tight">
            {t("dashboard.welcomeBack", { name: user?.username ?? "User" })}
          </h1>
        </div>
        <p className="text-ink-500 dark:text-surface-400 ml-[52px]">
          {t("dashboard.readyMessage")}
        </p>
      </div>

      {/* Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {shortcuts.map(({ href, label, desc, icon: Icon, gradient, bgGradient }, i) => (
          <Link key={href} href={href} className="group block">
            <div
              className="animate-fade-up animation-fill-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Card className="h-full transition-all duration-300 group-hover:shadow-soft-lg group-hover:-translate-y-1 cursor-pointer overflow-hidden relative">
                {/* Hover gradient accent on top */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-300 dark:text-ink-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                  <CardTitle className="mt-4 text-lg">{label}</CardTitle>
                  <CardDescription className="leading-relaxed">{desc}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Tip */}
      <div className="mt-10 animate-fade-up animation-fill-both animate-delay-500">
        <div className="rounded-2xl bg-gradient-to-r from-brand-50 via-brand-100/50 to-accent-50 dark:from-brand-950/40 dark:via-brand-900/20 dark:to-accent-950/30 border border-brand-200 dark:border-brand-800/50 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-white dark:bg-ink-900 flex items-center justify-center shadow-soft-sm shrink-0">
            <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-surface-100 text-sm">
              Getting Started
            </h3>
            <p className="text-sm text-ink-500 dark:text-surface-400 mt-1 leading-relaxed">
              Try asking the AI assistant a question, upload documents to your knowledge base, or create a custom agent for specialized tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
