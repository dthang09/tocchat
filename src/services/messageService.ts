import { supabase } from '../lib/supabase';
import type { Message, MessageType } from '../types';
import type { ChatMessage, ChatSender, MessagesPageResult, SendMessageParams } from '../features/chat/types';

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

      // Resolve sender profiles
      const senderIds = Array.from(
        new Set(rawBatch.map((m) => m.sender_id).filter((id): id is string => Boolean(id)))
      );

      const sendersMap: Record<string, ChatSender> = {};
      if (senderIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', senderIds);

        if (profiles) {
          for (const p of profiles) {
            sendersMap[p.id] = p;
          }
        }
      }

      const messages: ChatMessage[] = rawBatch.map((m) => ({
        ...m,
        status: 'sent',
        sender: m.sender_id ? sendersMap[m.sender_id] || null : null,
      }));

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

      // Resolve sender profiles
      const senderIds = Array.from(
        new Set(rawBatch.map((m) => m.sender_id).filter((id): id is string => Boolean(id)))
      );

      const sendersMap: Record<string, ChatSender> = {};
      if (senderIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', senderIds);

        if (profiles) {
          for (const p of profiles) {
            sendersMap[p.id] = p;
          }
        }
      }

      const messages: ChatMessage[] = rawBatch.map((m) => ({
        ...m,
        status: 'sent',
        sender: m.sender_id ? sendersMap[m.sender_id] || null : null,
      }));

      // Return in chronological order
      messages.reverse();

      return { messages, hasMore };
    } catch (err) {
      console.warn('[messageService] getOlderMessages failed:', err);
      throw err;
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
