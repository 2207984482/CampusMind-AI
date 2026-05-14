import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <header className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="font-semibold">CampusMind AI</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">{children}</main>
    </div>
  );
}
