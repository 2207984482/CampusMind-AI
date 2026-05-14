"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { MessageSquare, BookOpen, Bot, Settings } from "lucide-react";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200 dark:border-gray-800">
        <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <span className="font-semibold">CampusMind</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
