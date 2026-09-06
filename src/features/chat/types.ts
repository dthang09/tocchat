import type { Message, MessageType } from '../../types';

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatSender {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface ChatMessage extends Message {
  status?: MessageStatus;
  sender?: ChatSender | null;
}

export interface SendMessageParams {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: MessageType;
}

export interface MessagesPageResult {
  messages: ChatMessage[];
  hasMore: boolean;
}
