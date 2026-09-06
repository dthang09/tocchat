import type { Message, MessageType } from '../../types';

export type MessageStatus = 'sending' | 'sent' | 'failed';

export const QUICK_REACTIONS = ['❤️', '😂', '👍', '😢', '😡', '😮'] as const;
export type QuickReactionEmoji = (typeof QUICK_REACTIONS)[number];

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

export interface ReactionUser {
  user_id: string;
  user_name: string;
  avatar_url?: string | null;
  emoji: string;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  hasReacted: boolean;
  users: ReactionUser[];
}

export interface ReadReceiptUser {
  user_id: string;
  user_name: string;
  avatar_url?: string | null;
  read_at: string;
}

export interface ChatMessage extends Message {
  status?: MessageStatus;
  sender?: ChatSender | null;
  reply_to?: ReplyPreview | null;
  reactions?: ReactionGroup[];
  reads?: ReadReceiptUser[];
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
