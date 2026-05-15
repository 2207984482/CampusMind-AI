import client from "./client";
import type { APIResponse } from "@/types/api";
import type { Conversation, ConversationDetail, ChatRequest } from "@/types/chat";

/** Paginated conversation list response */
interface ConversationListData {
  conversations: Conversation[];
  total: number;
}

/** GET /conversations — list with pagination */
export async function listConversations(
  page = 1,
  pageSize = 20
): Promise<ConversationListData> {
  const res = await client.get<APIResponse<ConversationListData>>("/conversations", {
    params: { page, page_size: pageSize },
  });
  return res.data.data!;
}

/** GET /conversations/{id} — detail with messages */
export async function getConversation(id: string): Promise<ConversationDetail> {
  const res = await client.get<APIResponse<ConversationDetail>>(`/conversations/${id}`);
  return res.data.data!;
}

/** DELETE /conversations/{id} */
export async function deleteConversation(id: string): Promise<void> {
  await client.delete(`/conversations/${id}`);
}

/**
 * SSE streaming chat via fetch + ReadableStream.
 * Yields each text delta chunk as it arrives from the server.
 */
export async function* streamChat(
  request: ChatRequest,
  token: string
): AsyncGenerator<string> {
  const res = await fetch("/api/v1/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Stream request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // Keep incomplete last line in buffer
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.delta) yield data.delta;
          if (data.done) return;
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  }
}
