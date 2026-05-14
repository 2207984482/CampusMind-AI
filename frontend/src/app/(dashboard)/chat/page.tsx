import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Chat</h1>
      <Card className="flex flex-col items-center justify-center py-16 text-center" padding="lg">
        <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Coming in Week 2</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Real-time AI chat with streaming responses, conversation history, and Markdown rendering.
        </p>
      </Card>
    </div>
  );
}
