"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";

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

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-end px-6">
      <div className="relative" ref={menuRef}>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 hover:opacity-80">
          <Avatar src={user?.avatar_url} name={user?.username ?? "User"} size="sm" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.username}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
