"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  tokenCount?: number | null;
}

/** Code block with copy-to-clipboard button */
function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");

  // Inline code (no language class inside a <pre>)
  if (!match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-ink-800/60 text-surface-300
                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink-700"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className={className}>
        <code className={match ? `language-${match[1]}` : className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

const MessageBubble = memo(function MessageBubble({
  role,
  content,
  tokenCount,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 max-w-full", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-soft-sm",
          isUser
            ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white"
            : "bg-gradient-to-br from-ink-200 to-ink-300 text-ink-700 dark:from-ink-700 dark:to-ink-800 dark:text-surface-300"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-soft-sm"
            : "bg-white dark:bg-ink-900 border border-surface-200 dark:border-ink-800 shadow-soft-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <>
            <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={{
                  pre: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLPreElement>>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            {tokenCount != null && (
              <p className="mt-1.5 text-[11px] text-ink-400 dark:text-ink-500">
                {tokenCount} tokens
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export { MessageBubble };
