"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/store/chat-store";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Spinner } from "@/components/ui/spinner";
import {
  listConversations,
  getConversation,
  deleteConversation,
  streamChat,
} from "@/lib/api/chat";

export default function ChatConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

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

  /** Load conversation list + detail on mount or id change */
  useEffect(() => {
    setActiveConversation(conversationId);
    setLoading(true);

    Promise.all([
      listConversations(),
      getConversation(conversationId),
    ])
      .then(([listData, detail]) => {
        setConversations(
          listData.conversations.map((c) => ({
            id: c.id,
            title: c.title,
            model: c.model,
            updatedAt: c.updated_at,
          }))
        );
        // Map API messages to store format
        setMessages(
          detail.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at,
          }))
        );
      })
      .catch(() => toast.error("Failed to load conversation"))
      .finally(() => setLoading(false));
  }, [conversationId, setConversations, setActiveConversation, setMessages]);

  /** Handle sending a message */
  const handleSend = useCallback(
    async (text: string, model: string) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in first");
        return;
      }

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
            conversation_id: conversationId,
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

        const assistantMsg = {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: fullContent,
          createdAt: new Date().toISOString(),
        };
        addMessage(assistantMsg);
        setStreamingContent("");

        // Refresh conversation list to update titles/timestamps
        const data = await listConversations();
        setConversations(
          data.conversations.map((c) => ({
            id: c.id,
            title: c.title,
            model: c.model,
            updatedAt: c.updated_at,
          }))
        );
      } catch {
        toast.error("Failed to send message");
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    [conversationId, addMessage, setIsStreaming, setConversations]
  );

  /** Select a conversation */
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
