"use client";

import { memo } from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface SidebarConversation {
  id: string;
  title: string;
  model: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  conversations: SidebarConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

/** Simple relative time — no date-fns dependency */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const ChatSidebar = memo(function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ChatSidebarProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-surface-200 dark:border-ink-800 bg-surface-50 dark:bg-ink-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-surface-200 dark:border-ink-800">
        <Button variant="primary" size="sm" className="w-full" onClick={onNew}>
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare className="h-8 w-8 text-ink-300 dark:text-ink-600 mb-2" />
            <p className="text-xs text-ink-400 dark:text-ink-500">No conversations yet</p>
          </div>
        ) : (
          <ul className="py-2">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 flex items-start gap-2 group transition-colors",
                    "hover:bg-surface-100 dark:hover:bg-ink-900",
                    activeId === conv.id &&
                      "bg-brand-50 dark:bg-brand-950/40 border-r-2 border-brand-500"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        activeId === conv.id
                          ? "text-brand-700 dark:text-brand-300"
                          : "text-ink-800 dark:text-surface-200"
                      )}
                    >
                      {conv.title || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-ink-400 dark:text-ink-500">
                        {timeAgo(conv.updatedAt)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-200 dark:bg-ink-800 text-ink-500 dark:text-ink-400">
                        {conv.model}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="shrink-0 p-1 rounded-md text-ink-400 opacity-0 group-hover:opacity-100
                               hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
});

export { ChatSidebar };
