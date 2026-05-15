import { useCallback } from "react";
import client from "@/lib/api/client";
import { useChatStore } from "@/store/chat-store";
import type { APIResponse } from "@/types/api";

export function useChat() {
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

  const sendMessage = useCallback(
    async (content: string) => {
      setIsStreaming(true);
      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      });

      try {
        const { data } = await client.post<
          APIResponse<{ conversation_id: string; message: Message; response: Message }>
        >("/chat", {
          conversation_id: activeConversationId,
          message: content,
        });

        if (data.data) {
          if (!activeConversationId) {
            setActiveConversation(data.data.conversation_id);
          }
          addMessage(data.data.response);
        }
      } catch (err) {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          createdAt: new Date().toISOString(),
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [activeConversationId]
  );

  const loadConversations = useCallback(async () => {
    const { data } = await client.get<APIResponse>("/conversations");
    if (data.data) {
      setConversations(data.data.conversations);
    }
  }, []);

  return {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    sendMessage,
    loadConversations,
    setActiveConversation,
  };
}

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};
