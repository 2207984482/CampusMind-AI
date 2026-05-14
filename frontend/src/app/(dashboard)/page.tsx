"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare, BookOpen, Bot, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const shortcuts = [
    { href: "/chat", label: "AI Chat", desc: "Start a conversation", icon: MessageSquare },
    { href: "/knowledge", label: "Knowledge Base", desc: "Upload & query documents", icon: BookOpen },
    { href: "/agents", label: "Custom Agents", desc: "Build your AI assistant", icon: Bot },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username ?? "User"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your AI-powered campus assistant is ready.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {shortcuts.map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
                </div>
                <CardTitle className="mt-3">{label}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
