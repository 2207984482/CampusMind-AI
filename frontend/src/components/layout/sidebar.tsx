"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { MessageSquare, BookOpen, Bot, Settings, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/chat", label: t("sidebar.chat"), icon: MessageSquare },
    { href: "/knowledge", label: t("sidebar.knowledge"), icon: BookOpen },
    { href: "/agents", label: t("sidebar.agents"), icon: Bot },
  ];

  const bottomItems = [
    { href: "/settings", label: t("sidebar.settings"), icon: Settings },
  ];

  const baseLinkStyles =
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-56 flex flex-col bg-white dark:bg-ink-950 border-r border-surface-200 dark:border-ink-800">
      {/* Logo area */}
      <Link href="/" className="flex items-center gap-2.5 px-5 h-14 border-b border-surface-200 dark:border-ink-800">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-ink-900 dark:text-surface-100 tracking-tight">
          {t("sidebar.appName")}
        </span>
      </Link>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                baseLinkStyles,
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950/60 dark:text-brand-300"
                  : "text-ink-600 hover:bg-surface-100 hover:text-ink-900 dark:text-surface-400 dark:hover:bg-ink-800 dark:hover:text-surface-200"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-brand-600 dark:text-brand-400")} />
              {label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500 animate-scale-in" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-surface-200 dark:border-ink-800 space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                baseLinkStyles,
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950/60 dark:text-brand-300"
                  : "text-ink-500 hover:bg-surface-100 hover:text-ink-700 dark:text-surface-500 dark:hover:bg-ink-800 dark:hover:text-surface-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
