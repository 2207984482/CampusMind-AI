"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "@/i18n";
import { useLanguage } from "@/i18n";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const { t } = useLanguage();

  return (
    <header className="h-14 border-b border-surface-200 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur-lg flex items-center justify-between px-6">
      <LanguageSwitcher />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 -mr-2 rounded-xl hover:bg-surface-100 dark:hover:bg-ink-800 transition-all duration-200"
        >
          <Avatar src={user?.avatar_url} name={user?.username ?? "User"} size="sm" />
          <span className="text-sm font-medium text-ink-700 dark:text-surface-300 hidden sm:inline">
            {user?.username}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-ink-400 dark:text-surface-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-surface-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-soft-lg py-1 animate-scale-in origin-top-right">
            {/* User info */}
            <div className="px-3 py-2.5 border-b border-surface-100 dark:border-ink-800">
              <p className="text-sm font-medium text-ink-900 dark:text-surface-100">{user?.username}</p>
              <p className="text-xs text-ink-500 dark:text-surface-500 truncate">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("common.signOut")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
