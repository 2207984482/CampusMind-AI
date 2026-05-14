import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Custom Agents</h1>
      <Card className="flex flex-col items-center justify-center py-16 text-center" padding="lg">
        <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4">
          <Bot className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Coming in Week 4</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Create custom AI agents with defined tools, system prompts, and persistent memory for specialized tasks.
        </p>
      </Card>
    </div>
  );
}
