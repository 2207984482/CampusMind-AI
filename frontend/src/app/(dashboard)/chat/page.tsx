"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/store/chat-store";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Spinner } from "@/components/ui/spinner";
import {
  listConversations,
  deleteConversation,
  streamChat,
} from "@/lib/api/chat";
import type { Message as ApiMessage } from "@/types/chat";

export default function ChatPage() {
  const router = useRouter();
  const {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    setConversations,
    setActiveConversation,
    setMessages,
    addMessage,
    setIsStreaming,
  } = useChatStore();

  const [streamingContent, setStreamingContent] = useState("");
  const [loading, setLoading] = useState(true);

  /** Load conversations on mount */
  useEffect(() => {
    listConversations()
      .then((data) => {
        setConversations(
          data.conversations.map((c) => ({
            id: c.id,
            title: c.title,
            model: c.model,
            updatedAt: c.updated_at,
          }))
        );
      })
      .catch(() => toast.error("Failed to load conversations"))
      .finally(() => setLoading(false));
  }, [setConversations]);

  /** Handle sending a message */
  const handleSend = useCallback(
    async (text: string, model: string) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in first");
        return;
      }

      // Add user message to store immediately
      const userMsg = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: text,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMsg);
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const generator = streamChat(
          {
            conversation_id: activeConversationId || undefined,
            message: text,
            model,
          },
          token
        );

        let fullContent = "";
        for await (const delta of generator) {
          fullContent += delta;
          setStreamingContent(fullContent);
        }

        // Add assistant message to store
        const assistantMsg = {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: fullContent,
          createdAt: new Date().toISOString(),
        };
        addMessage(assistantMsg);
        setStreamingContent("");

        // Refresh conversation list
        const data = await listConversations();
        setConversations(
          data.conversations.map((c) => ({
            id: c.id,
            title: c.title,
            model: c.model,
            updatedAt: c.updated_at,
          }))
        );

        // If this was a new conversation, navigate to the first conversation
        if (!activeConversationId && data.conversations.length > 0) {
          const latest = data.conversations[0];
          setActiveConversation(latest.id);
          router.push(`/chat/${latest.id}`);
        }
      } catch {
        toast.error("Failed to send message");
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    [activeConversationId, addMessage, setIsStreaming, setConversations, setActiveConversation, router]
  );

  /** Select a conversation — navigate to its page */
  const handleSelect = useCallback(
    (id: string) => {
      setActiveConversation(id);
      router.push(`/chat/${id}`);
    },
    [setActiveConversation, router]
  );

  /** New chat */
  const handleNew = useCallback(() => {
    setActiveConversation(null);
    setMessages([]);
    router.push("/chat");
  }, [setActiveConversation, setMessages, router]);

  /** Delete conversation */
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteConversation(id);
        setConversations(conversations.filter((c) => c.id !== id));
        if (activeConversationId === id) {
          setActiveConversation(null);
          setMessages([]);
          router.push("/chat");
        }
        toast.success("Conversation deleted");
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [conversations, activeConversationId, setConversations, setActiveConversation, setMessages, router]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full -m-6">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatMessages
          messages={messages}
          streamingContent={streamingContent}
        />
        <ChatInput onSend={handleSend} streaming={isStreaming} />
      </div>
    </div>
  );
}
