export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  token_count: number | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  total_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface ChatRequest {
  conversation_id?: string;
  message: string;
  model?: string;
}
