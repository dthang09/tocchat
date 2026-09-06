import { supabase } from '../lib/supabase';
import type { Message, MessageType } from '../types';
import type {
  ChatMessage,
  ChatSender,
  MessagesPageResult,
  SendMessageParams,
  ReplyPreview,
} from '../features/chat/types';

/**
 * Helper to resolve sender profiles and reply previews for a batch of messages
 */
async function hydrateMessages(rawBatch: Message[]): Promise<ChatMessage[]> {
  if (rawBatch.length === 0) return [];

  // 1. Collect all sender IDs and reply IDs
  const senderIds = new Set<string>();
  const replyIds = new Set<string>();

  for (const m of rawBatch) {
    if (m.sender_id) senderIds.add(m.sender_id);
    if (m.reply_to_message_id) replyIds.add(m.reply_to_message_id);
  }

  // 2. Fetch missing reply messages (ones not already in this batch)
  const existingRepliesMap = new Map<string, Message>();
  for (const m of rawBatch) {
    existingRepliesMap.set(m.id, m);
  }

  const missingReplyIds = Array.from(replyIds).filter((id) => !existingRepliesMap.has(id));

  if (missingReplyIds.length > 0) {
    const { data: missingReplies, error: replyError } = await supabase
      .from('messages')
      .select('*')
      .in('id', missingReplyIds);

    if (!replyError && missingReplies) {
      for (const rm of missingReplies as Message[]) {
        existingRepliesMap.set(rm.id, rm);
        if (rm.sender_id) senderIds.add(rm.sender_id);
      }
    }
  }

  // 3. Fetch all needed sender profiles
  const sendersMap: Record<string, ChatSender> = {};
  const allSenderIds = Array.from(senderIds);

  if (allSenderIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', allSenderIds);

    if (profiles) {
      for (const p of profiles) {
        sendersMap[p.id] = p;
      }
    }
  }

  // 4. Map into ChatMessage with reply_to preview
  return rawBatch.map((m) => {
    let reply_to: ReplyPreview | null = null;

    if (m.reply_to_message_id) {
      const target = existingRepliesMap.get(m.reply_to_message_id);
      if (target) {
        const isDeleted = Boolean(target.deleted_at);
        const targetSender = target.sender_id ? sendersMap[target.sender_id] : null;

        reply_to = {
          id: target.id,
          sender_id: target.sender_id,
          sender_name: targetSender?.display_name || 'Người dùng',
          content: isDeleted ? 'Tin nhắn đã bị xóa' : target.content,
          type: target.type,
          is_deleted: isDeleted,
        };
      } else {
        reply_to = {
          id: m.reply_to_message_id,
          sender_id: null,
          sender_name: 'Người dùng',
          content: 'Tin nhắn không còn khả dụng',
          type: 'text',
          is_deleted: true,
        };
      }
    }

    return {
      ...m,
      status: 'sent',
      sender: m.sender_id ? sendersMap[m.sender_id] || null : null,
      reply_to,
    };
  });
}

export const messageService = {
  /**
   * Fetch the latest batch of messages in a conversation
   */
  async getLatestMessages(conversationId: string, limit = 40): Promise<MessagesPageResult> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit + 1);

      if (error) {
        console.warn('[messageService] getLatestMessages error:', error.message);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return { messages: [], hasMore: false };
      }

      const hasMore = data.length > limit;
      const rawBatch = (hasMore ? data.slice(0, limit) : data) as Message[];

      const messages = await hydrateMessages(rawBatch);

      // Return in chronological order (earliest first, newest last)
      messages.reverse();

      return { messages, hasMore };
    } catch (err) {
      console.warn('[messageService] getLatestMessages failed:', err);
      throw err;
    }
  },

  /**
   * Fetch older messages before a specific timestamp (backward pagination)
   */
  async getOlderMessages(
    conversationId: string,
    beforeCreatedAt: string,
    limit = 40
  ): Promise<MessagesPageResult> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .lt('created_at', beforeCreatedAt)
        .order('created_at', { ascending: false })
        .limit(limit + 1);

      if (error) {
        console.warn('[messageService] getOlderMessages error:', error.message);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return { messages: [], hasMore: false };
      }

      const hasMore = data.length > limit;
      const rawBatch = (hasMore ? data.slice(0, limit) : data) as Message[];

      const messages = await hydrateMessages(rawBatch);

      // Return in chronological order
      messages.reverse();

      return { messages, hasMore };
    } catch (err) {
      console.warn('[messageService] getOlderMessages failed:', err);
      throw err;
    }
  },

  /**
   * Fetch messages up to and including a specific target message ID
   * Used when jumping to an older quoted message not yet loaded in state
   */
  async getMessagesUpTo(
    conversationId: string,
    targetMessageId: string,
    currentOldestCreatedAt: string
  ): Promise<{ messages: ChatMessage[]; found: boolean }> {
    try {
      // 1. Check target message
      const { data: targetMsg, error: targetError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', targetMessageId)
        .maybeSingle();

      if (targetError || !targetMsg) {
        return { messages: [], found: false };
      }

      // 2. Fetch from target message created_at up to current oldest
      const { data: batch, error: batchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .gte('created_at', targetMsg.created_at)
        .lt('created_at', currentOldestCreatedAt)
        .order('created_at', { ascending: false })
        .limit(60);

      if (batchError || !batch) {
        return { messages: [], found: false };
      }

      const hydrated = await hydrateMessages(batch as Message[]);
      hydrated.reverse();

      return { messages: hydrated, found: true };
    } catch (err) {
      console.warn('[messageService] getMessagesUpTo failed:', err);
      return { messages: [], found: false };
    }
  },

  /**
   * Insert a new message into the database
   */
  async sendMessage(params: SendMessageParams): Promise<void> {
    const id = params.id || crypto.randomUUID();
    const now = new Date().toISOString();

    const insertPayload = {
      id,
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      type: (params.type || 'text') as MessageType,
      content: params.content,
      reply_to_message_id: params.replyToMessageId || null,
      created_at: now,
    };

    const { error } = await supabase.from('messages').insert(insertPayload);

    if (error) {
      console.warn('[messageService] sendMessage error:', error.message);
      throw new Error(error.message);
    }

    // Update conversation updated_at in the background
    supabase
      .from('conversations')
      .update({ updated_at: now })
      .eq('id', params.conversationId)
      .then(({ error: updateErr }) => {
        if (updateErr) {
          console.warn('[messageService] update conversation updated_at error:', updateErr.message);
        }
      });
  },

  /**
   * Fetch single user profile for newly arrived realtime message
   */
  async getSenderProfile(senderId: string): Promise<ChatSender | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', senderId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  },

  /**
   * Fetch single message details (for reply resolution)
   */
  async getMessageById(messageId: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Message;
  },

  /**
   * Realtime subscription for conversation messages
   */
  subscribeToConversationMessages(
    conversationId: string,
    onNewMessage: (message: Message) => void
  ): () => void {
    const channelName = `messages:${conversationId}:${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
