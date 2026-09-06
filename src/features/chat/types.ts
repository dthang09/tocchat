import type { Message, MessageType } from '../../types';

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatSender {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface ReplyPreview {
  id: string;
  sender_id: string | null;
  sender_name: string | null;
  content: string | null;
  type: MessageType;
  is_deleted?: boolean;
}

export interface ChatMessage extends Message {
  status?: MessageStatus;
  sender?: ChatSender | null;
  reply_to?: ReplyPreview | null;
}

export interface SendMessageParams {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  replyToMessageId?: string | null;
}

export interface MessagesPageResult {
  messages: ChatMessage[];
  hasMore: boolean;
}
