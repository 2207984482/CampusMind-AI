"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/i18n";
import { MessageSquare } from "lucide-react";

export default function ChatConversationPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <Card className="flex flex-col items-center justify-center py-20 text-center" padding="lg">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
        <p className="text-ink-500 dark:text-surface-400">{t("chat.placeholder")}</p>
      </Card>
    </div>
  );
}
