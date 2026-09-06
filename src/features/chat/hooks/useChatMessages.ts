import { useState, useEffect, useRef, useCallback } from 'react';
import { messageService } from '../../../services/messageService';
import type { ChatMessage, ChatSender } from '../types';
import type { Message } from '../../../types';

interface UseChatMessagesProps {
  conversationId: string;
  currentUserId?: string;
  currentUserProfile?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  membersMap?: Record<string, ChatSender>;
}

export function useChatMessages({
  conversationId,
  currentUserId,
  currentUserProfile,
  membersMap = {},
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref of messages for realtime event deduplication without stale state
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const membersMapRef = useRef(membersMap);
  membersMapRef.current = membersMap;

  // 1. Initial Load of latest messages
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setMessages([]);

    messageService
      .getLatestMessages(conversationId, 40)
      .then((res) => {
        if (!isMounted) return;
        setMessages(res.messages);
        setHasMore(res.hasMore);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Không thể tải tin nhắn');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // 2. Realtime subscription for incoming messages
  useEffect(() => {
    if (!conversationId) return;

    const handleIncomingMessage = async (newMsg: Message) => {
      // Check if message is already in our list (e.g. from optimistic send)
      const existing = messagesRef.current.find((m) => m.id === newMsg.id);

      if (existing) {
        // Just ensure status is sent
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'sent' } : m))
        );
        return;
      }

      // Resolve sender info
      let sender: ChatSender | null = null;
      if (newMsg.sender_id) {
        if (newMsg.sender_id === currentUserId) {
          sender = {
            id: currentUserId,
            display_name: currentUserProfile?.display_name || 'Tôi',
            avatar_url: currentUserProfile?.avatar_url || null,
          };
        } else if (membersMapRef.current[newMsg.sender_id]) {
          sender = membersMapRef.current[newMsg.sender_id];
        } else {
          sender = await messageService.getSenderProfile(newMsg.sender_id);
        }
      }

      const formatted: ChatMessage = {
        ...newMsg,
        status: 'sent',
        sender,
      };

      setMessages((prev) => {
        // Secondary guard against duplicate insertion in race conditions
        if (prev.some((m) => m.id === formatted.id)) {
          return prev;
        }
        return [...prev, formatted];
      });
    };

    const unsubscribe = messageService.subscribeToConversationMessages(
      conversationId,
      handleIncomingMessage
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, currentUserId, currentUserProfile]);

  // 3. Send message with optimistic update
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !conversationId || !currentUserId) return;

      const messageId = crypto.randomUUID();
      const now = new Date().toISOString();

      const optimisticMessage: ChatMessage = {
        id: messageId,
        conversation_id: conversationId,
        sender_id: currentUserId,
        type: 'text',
        content: trimmed,
        reply_to_message_id: null,
        created_at: now,
        edited_at: null,
        deleted_at: null,
        metadata: null,
        status: 'sending',
        sender: {
          id: currentUserId,
          display_name: currentUserProfile?.display_name || 'Tôi',
          avatar_url: currentUserProfile?.avatar_url || null,
        },
      };

      // Immediately append optimistic message
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        await messageService.sendMessage({
          id: messageId,
          conversationId,
          senderId: currentUserId,
          content: trimmed,
          type: 'text',
        });

        // Mark as sent
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'sent' } : m))
        );
      } catch (err) {
        console.error('[useChatMessages] Send message error:', err);
        // Mark as failed for retry
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'failed' } : m))
        );
      }
    },
    [conversationId, currentUserId, currentUserProfile]
  );

  // 4. Retry failed message
  const retryMessage = useCallback(
    async (messageId: string) => {
      const target = messagesRef.current.find((m) => m.id === messageId);
      if (!target || !target.content || !currentUserId) return;

      // Set status to sending
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'sending' } : m))
      );

      try {
        await messageService.sendMessage({
          id: target.id,
          conversationId: target.conversation_id,
          senderId: currentUserId,
          content: target.content,
          type: target.type,
        });

        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'sent' } : m))
        );
      } catch (err) {
        console.error('[useChatMessages] Retry message error:', err);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'failed' } : m))
        );
      }
    },
    [currentUserId]
  );

  // 5. Backward pagination: load older messages
  const loadOlderMessages = useCallback(async (): Promise<boolean> => {
    if (isLoadingOlder || !hasMore || messagesRef.current.length === 0) {
      return false;
    }

    setIsLoadingOlder(true);
    const oldestMessage = messagesRef.current[0];

    try {
      const res = await messageService.getOlderMessages(
        conversationId,
        oldestMessage.created_at,
        40
      );

      if (res.messages.length > 0) {
        setMessages((prev) => {
          // Deduplicate any overlapping items
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = res.messages.filter((m) => !existingIds.has(m.id));
          return [...fresh, ...prev];
        });
      }

      setHasMore(res.hasMore);
      return true;
    } catch (err) {
      console.warn('[useChatMessages] loadOlderMessages failed:', err);
      return false;
    } finally {
      setIsLoadingOlder(false);
    }
  }, [conversationId, hasMore, isLoadingOlder]);

  return {
    messages,
    isLoading,
    isLoadingOlder,
    hasMore,
    error,
    sendMessage,
    retryMessage,
    loadOlderMessages,
  };
}
