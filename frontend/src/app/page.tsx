"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n";
import { MessageSquare, BookOpen, Bot, Sparkles, ArrowRight, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("landing.featureChatTitle"),
      desc: t("landing.featureChatDesc"),
      icon: MessageSquare,
      gradient: "from-brand-500 to-brand-600",
      bgGradient: "from-brand-50 to-brand-100 dark:from-brand-950/50 dark:to-brand-900/30",
    },
    {
      title: t("landing.featureKnowledgeTitle"),
      desc: t("landing.featureKnowledgeDesc"),
      icon: BookOpen,
      gradient: "from-accent-500 to-accent-600",
      bgGradient: "from-accent-50 to-accent-100 dark:from-accent-950/50 dark:to-accent-900/30",
    },
    {
      title: t("landing.featureAgentsTitle"),
      desc: t("landing.featureAgentsDesc"),
      icon: Bot,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-ink-950 overflow-hidden">
      {/* ============ GLOBAL DECORATIVE ELEMENTS ============ */}
      {/* Top-right glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-200/30 via-brand-300/10 to-transparent dark:from-brand-900/20 dark:via-brand-800/5 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      {/* Bottom-left glow */}
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent-200/20 via-accent-300/5 to-transparent dark:from-accent-900/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ============ HEADER ============ */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-ink-900 dark:text-surface-100 tracking-tight">
            CampusMind
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-ink-600 hover:text-ink-900 dark:text-surface-400 dark:hover:text-surface-200 transition-colors px-2 py-1"
          >
            {t("common.signIn")}
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-soft-sm hover:shadow-glow-sm hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] transition-all duration-200"
          >
            {t("common.getStarted")}
          </Link>
        </div>
      </header>

      {/* ============ HERO SECTION ============ */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
        {/* Badge */}
        <div className="animate-fade-down animation-fill-both mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-sm font-medium text-brand-700 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t("landing.badge") ?? "AI-Powered Campus Assistant"}
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up animation-fill-both text-display-lg text-ink-900 dark:text-surface-100">
          {t("landing.title")}{" "}
          <span className="text-gradient-brand">
            {t("landing.titleHighlight")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up animation-fill-both animate-delay-100 mt-6 text-lg text-ink-500 dark:text-surface-400 max-w-xl mx-auto leading-relaxed">
          {t("landing.subtitle")}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up animation-fill-both animate-delay-200 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white font-semibold shadow-soft-md hover:shadow-glow-md hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] transition-all duration-200"
          >
            {t("common.startFree")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-surface-300 dark:border-ink-700 font-semibold text-ink-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-ink-800 hover:border-surface-400 dark:hover:border-ink-600 shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
          >
            {t("common.signIn")}
          </Link>
        </div>

        {/* ============ FEATURE CARDS ============ */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="animate-fade-up animation-fill-both group relative overflow-hidden"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              {/* Card background with subtle gradient */}
              <div className="relative p-6 rounded-2xl bg-white dark:bg-ink-900 border border-surface-200 dark:border-ink-800 shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
                {/* Gradient accent line on top */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-5 w-5 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                </div>

                <h3 className="font-semibold text-ink-900 dark:text-surface-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-ink-500 dark:text-surface-400 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Subtle hover arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ============ STATS / SOCIAL PROOF ============ */}
        <div className="mt-24 py-12 border-t border-surface-200 dark:border-ink-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "24/7", label: "AI Availability" },
              { value: "50+", label: "Knowledge Bases" },
              { value: "99.9%", label: "Uptime" },
              { value: "10k+", label: "Students Served" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-up animation-fill-both text-center"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div className="text-3xl font-bold text-ink-900 dark:text-surface-100 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-ink-500 dark:text-surface-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t border-surface-200 dark:border-ink-800 bg-white/50 dark:bg-ink-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-ink-500 dark:text-surface-400">
              CampusMind AI. Built for students.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink-400 dark:text-surface-500">
            <Link href="/login" className="hover:text-ink-700 dark:hover:text-surface-300 transition-colors">
              {t("common.signIn")}
            </Link>
            <Link href="/register" className="hover:text-ink-700 dark:hover:text-surface-300 transition-colors">
              {t("common.getStarted")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
