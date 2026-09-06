import { supabase } from '../lib/supabase';
import type { Message, MessageType, MessageReaction, MessageRead } from '../types';
import type {
  ChatMessage,
  ChatSender,
  MessagesPageResult,
  SendMessageParams,
  ReplyPreview,
  ReactionGroup,
  ReactionUser,
  ReadReceiptUser,
  TypingBroadcastPayload,
} from '../features/chat/types';

// Map of active conversation realtime channels to broadcast typing without creating duplicate channels
const activeConversationChannels = new Map<string, ReturnType<typeof supabase.channel>>();

/**
 * Helper to resolve sender profiles, reply previews, reactions, and read receipts for a batch of messages
 */
async function hydrateMessages(rawBatch: Message[], currentUserId?: string): Promise<ChatMessage[]> {
  if (rawBatch.length === 0) return [];

  const messageIds = rawBatch.map((m) => m.id);
  const senderIds = new Set<string>();
  const replyIds = new Set<string>();

  for (const m of rawBatch) {
    if (m.sender_id) senderIds.add(m.sender_id);
    if (m.reply_to_message_id) replyIds.add(m.reply_to_message_id);
  }

  // 1. Fetch reactions for these messages
  const { data: reactionsData, error: reactionsError } = await supabase
    .from('message_reactions')
    .select('*')
    .in('message_id', messageIds);

  const rawReactions = (!reactionsError && reactionsData ? reactionsData : []) as MessageReaction[];

  for (const r of rawReactions) {
    if (r.user_id) senderIds.add(r.user_id);
  }

  // 2. Fetch read receipts for these messages
  const { data: readsData, error: readsError } = await supabase
    .from('message_reads')
    .select('*')
    .in('message_id', messageIds);

  const rawReads = (!readsError && readsData ? readsData : []) as MessageRead[];

  for (const rd of rawReads) {
    if (rd.user_id) senderIds.add(rd.user_id);
  }

  // 3. Fetch missing reply messages (ones not already in this batch)
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

  // 4. Fetch all needed profiles (senders + reaction authors + read receipt readers)
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

  // 5. Group reactions by message_id
  const reactionsByMessage: Record<string, Record<string, ReactionUser[]>> = {};
  for (const r of rawReactions) {
    if (!reactionsByMessage[r.message_id]) {
      reactionsByMessage[r.message_id] = {};
    }
    if (!reactionsByMessage[r.message_id][r.emoji]) {
      reactionsByMessage[r.message_id][r.emoji] = [];
    }

    const uProfile = sendersMap[r.user_id];
    reactionsByMessage[r.message_id][r.emoji].push({
      user_id: r.user_id,
      user_name: uProfile?.display_name || 'Người dùng',
      avatar_url: uProfile?.avatar_url || null,
      emoji: r.emoji,
    });
  }

  // 6. Group read receipts by message_id
  const readsByMessage: Record<string, ReadReceiptUser[]> = {};
  for (const rd of rawReads) {
    if (!readsByMessage[rd.message_id]) {
      readsByMessage[rd.message_id] = [];
    }
    const uProfile = sendersMap[rd.user_id];
    readsByMessage[rd.message_id].push({
      user_id: rd.user_id,
      user_name: uProfile?.display_name || 'Người dùng',
      avatar_url: uProfile?.avatar_url || null,
      read_at: rd.read_at,
    });
  }

  // 7. Map into ChatMessage with reply_to, reactions, and reads
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

    const msgReactionsRecord = reactionsByMessage[m.id] || {};
    const reactions: ReactionGroup[] = Object.entries(msgReactionsRecord).map(
      ([emoji, users]) => ({
        emoji,
        count: users.length,
        hasReacted: users.some((u) => u.user_id === currentUserId),
        users,
      })
    );

    const reads: ReadReceiptUser[] = readsByMessage[m.id] || [];

    return {
      ...m,
      status: 'sent',
      sender: m.sender_id ? sendersMap[m.sender_id] || null : null,
      reply_to,
      reactions,
      reads,
    };
  });
}

export const messageService = {
  /**
   * Fetch the latest batch of messages in a conversation
   */
  async getLatestMessages(
    conversationId: string,
    limit = 40,
    currentUserId?: string
  ): Promise<MessagesPageResult> {
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

      const messages = await hydrateMessages(rawBatch, currentUserId);

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
    limit = 40,
    currentUserId?: string
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

      const messages = await hydrateMessages(rawBatch, currentUserId);

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
   */
  async getMessagesUpTo(
    conversationId: string,
    targetMessageId: string,
    currentOldestCreatedAt: string,
    currentUserId?: string
  ): Promise<{ messages: ChatMessage[]; found: boolean }> {
    try {
      const { data: targetMsg, error: targetError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', targetMessageId)
        .maybeSingle();

      if (targetError || !targetMsg) {
        return { messages: [], found: false };
      }

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

      const hydrated = await hydrateMessages(batch as Message[], currentUserId);
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
   * Batch mark messages as read
   * Avoids one request per message by inserting/upserting multiple rows at once
   */
  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    if (!messageIds || messageIds.length === 0 || !userId) return;

    const rows = messageIds.map((id) => ({
      message_id: id,
      user_id: userId,
      read_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('message_reads')
      .upsert(rows, { onConflict: 'message_id,user_id' });

    if (error) {
      console.warn('[messageService] markMessagesAsRead error:', error.message);
    }
  },

  /**
   * Add a reaction to a message
   */
  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        emoji,
      });

    if (error) {
      console.warn('[messageService] addReaction error:', error.message);
      throw new Error(error.message);
    }
  },

  /**
   * Remove own reaction from a message
   */
  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji);

    if (error) {
      console.warn('[messageService] removeReaction error:', error.message);
      throw new Error(error.message);
    }
  },

  /**
   * Change own reaction on a message (replace old with new)
   */
  async changeReaction(
    messageId: string,
    userId: string,
    oldEmoji: string,
    newEmoji: string
  ): Promise<void> {
    await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', oldEmoji);

    const { error: insertErr } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        emoji: newEmoji,
      });

    if (insertErr) {
      console.warn('[messageService] changeReaction insert error:', insertErr.message);
      throw new Error(insertErr.message);
    }
  },

  /**
   * Fetch single user profile
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
   * Fetch single message details
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
   * Realtime subscription for conversation messages, reactions, read receipts, and typing broadcast
   */
  subscribeToConversation(
    conversationId: string,
    callbacks: {
      onNewMessage: (message: Message) => void;
      onReactionInsert?: (reaction: MessageReaction) => void;
      onReactionDelete?: (reaction: MessageReaction) => void;
      onReadReceipt?: (read: MessageRead) => void;
      onTyping?: (payload: TypingBroadcastPayload) => void;
    }
  ): () => void {
    const channelName = `conversation:${conversationId}`;

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
            callbacks.onNewMessage(payload.new as Message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          if (payload.new && callbacks.onReactionInsert) {
            callbacks.onReactionInsert(payload.new as MessageReaction);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          if (payload.old && callbacks.onReactionDelete) {
            callbacks.onReactionDelete(payload.old as MessageReaction);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reads',
        },
        (payload) => {
          if (payload.new && callbacks.onReadReceipt) {
            callbacks.onReadReceipt(payload.new as MessageRead);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'typing' },
        ({ payload }) => {
          if (payload && callbacks.onTyping) {
            callbacks.onTyping(payload as TypingBroadcastPayload);
          }
        }
      )
      .subscribe();

    activeConversationChannels.set(conversationId, channel);

    return () => {
      activeConversationChannels.delete(conversationId);
      supabase.removeChannel(channel);
    };
  },

  /**
   * Broadcast typing status via Supabase Realtime Broadcast (ephemeral, not stored in DB)
   */
  sendTypingIndicator(
    conversationId: string,
    payload: TypingBroadcastPayload
  ): void {
    const channel = activeConversationChannels.get(conversationId);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload,
      }).catch((err) => {
        console.warn('[messageService] sendTypingIndicator error:', err);
      });
    }
  },
};
