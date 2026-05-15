"use client";

import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { MessageBubble } from "./message-bubble";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatMessagesProps {
  messages: DisplayMessage[];
  streamingContent?: string;
}

export function ChatMessages({ messages, streamingContent }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const isEmpty = messages.length === 0 && !streamingContent;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-ink-900 dark:text-surface-100 mb-1">
              Start a conversation
            </h2>
            <p className="text-sm text-ink-500 dark:text-surface-400">
              Type a message below to begin chatting with AI
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
              />
            ))}

            {/* Streaming bubble */}
            {streamingContent && (
              <MessageBubble role="assistant" content={streamingContent} tokenCount={null} />
            )}

            {/* Loading indicator when waiting for first token */}
            {!streamingContent && messages.length > 0 && messages[messages.length - 1].role === "user" && null}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
