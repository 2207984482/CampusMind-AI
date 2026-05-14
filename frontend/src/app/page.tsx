import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-lg">CampusMind AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Your AI-Powered{" "}
          <span className="text-brand-600">Campus Assistant</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Chat with AI about coursework, upload documents for smart Q&A, and build custom AI agents for campus life.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {[
            { title: "AI Chat", desc: "Real-time streaming conversations with advanced campus-knowledgeable AI." },
            { title: "Knowledge Base", desc: "Upload PDFs and documents for intelligent RAG-powered Q&A." },
            { title: "Custom Agents", desc: "Build personalized AI agents with tools and persistent memory." },
          ].map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
