"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string, model: string) => void;
  streaming: boolean;
}

const MODELS = ["deepseek-chat", "gpt-4o"];

export function ChatInput({ onSend, streaming }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Auto-resize textarea from 1 to 5 rows */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineH = 24; // approximate line height in px
    const maxH = lineH * 5;
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
  }, [message]);

  const handleSubmit = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || streaming) return;
    onSend(trimmed, model);
    setMessage("");
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, model, onSend, streaming]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-surface-200 dark:border-ink-800 bg-white dark:bg-ink-950 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 rounded-2xl border border-surface-300 dark:border-ink-700 bg-surface-50 dark:bg-ink-900 px-4 py-3 shadow-soft-sm focus-within:ring-2 focus-within:ring-brand-400/50 focus-within:border-brand-400 transition-all">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={streaming}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-ink-900 dark:text-surface-100",
              "placeholder:text-surface-400 dark:placeholder:text-ink-500",
              "focus:outline-none disabled:opacity-50",
              "min-h-[24px] leading-6"
            )}
          />

          {/* Model selector */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={streaming}
            className={cn(
              "shrink-0 text-xs rounded-lg border border-surface-200 dark:border-ink-700",
              "bg-white dark:bg-ink-800 text-ink-600 dark:text-surface-400",
              "px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-400",
              "disabled:opacity-50 cursor-pointer"
            )}
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={streaming || !message.trim()}
            className={cn(
              "shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all",
              "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-soft-sm",
              "hover:from-brand-500 hover:to-brand-600 hover:shadow-glow-sm",
              "active:scale-95",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            )}
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-400 dark:text-ink-500">
          Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
