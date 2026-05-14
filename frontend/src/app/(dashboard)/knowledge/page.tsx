import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Knowledge Base</h1>
      <Card className="flex flex-col items-center justify-center py-16 text-center" padding="lg">
        <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Coming in Week 3</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Upload PDF documents and query them with RAG-powered semantic search and AI responses.
        </p>
      </Card>
    </div>
  );
}
