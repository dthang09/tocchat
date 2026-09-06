import { useState, useEffect, useRef, useCallback } from 'react';
import { messageService } from '../../../services/messageService';
import type { ChatMessage, ChatSender, ReplyPreview } from '../types';
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

  // Reply state
  const [replyingTo, setReplyingTo] = useState<ReplyPreview | null>(null);

  // Jump-to highlight state
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setReplyingTo(null);
    setHighlightedMessageId(null);

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
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [conversationId]);

  // 2. Realtime subscription for incoming messages
  useEffect(() => {
    if (!conversationId) return;

    const handleIncomingMessage = async (newMsg: Message) => {
      // Check if message is already in our list (e.g. from optimistic send)
      const existing = messagesRef.current.find((m) => m.id === newMsg.id);

      if (existing) {
        // Ensure status is sent
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

      // Resolve reply preview if present
      let reply_to: ReplyPreview | null = null;
      if (newMsg.reply_to_message_id) {
        const localTarget = messagesRef.current.find((m) => m.id === newMsg.reply_to_message_id);
        if (localTarget) {
          reply_to = {
            id: localTarget.id,
            sender_id: localTarget.sender_id,
            sender_name: localTarget.sender?.display_name || 'Người dùng',
            content: localTarget.deleted_at ? 'Tin nhắn đã bị xóa' : localTarget.content,
            type: localTarget.type,
            is_deleted: Boolean(localTarget.deleted_at),
          };
        } else {
          // Fetch target message details
          const fetchedTarget = await messageService.getMessageById(newMsg.reply_to_message_id);
          if (fetchedTarget) {
            let targetSenderName = 'Người dùng';
            if (fetchedTarget.sender_id) {
              if (membersMapRef.current[fetchedTarget.sender_id]) {
                targetSenderName = membersMapRef.current[fetchedTarget.sender_id].display_name || 'Người dùng';
              } else {
                const s = await messageService.getSenderProfile(fetchedTarget.sender_id);
                if (s?.display_name) targetSenderName = s.display_name;
              }
            }
            reply_to = {
              id: fetchedTarget.id,
              sender_id: fetchedTarget.sender_id,
              sender_name: targetSenderName,
              content: fetchedTarget.deleted_at ? 'Tin nhắn đã bị xóa' : fetchedTarget.content,
              type: fetchedTarget.type,
              is_deleted: Boolean(fetchedTarget.deleted_at),
            };
          } else {
            reply_to = {
              id: newMsg.reply_to_message_id,
              sender_id: null,
              sender_name: 'Người dùng',
              content: 'Tin nhắn không còn khả dụng',
              type: 'text',
              is_deleted: true,
            };
          }
        }
      }

      const formatted: ChatMessage = {
        ...newMsg,
        status: 'sent',
        sender,
        reply_to,
      };

      setMessages((prev) => {
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

  // 3. Send message with optimistic update & reply support
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !conversationId || !currentUserId) return;

      const messageId = crypto.randomUUID();
      const now = new Date().toISOString();
      const activeReply = replyingTo;

      const optimisticMessage: ChatMessage = {
        id: messageId,
        conversation_id: conversationId,
        sender_id: currentUserId,
        type: 'text',
        content: trimmed,
        reply_to_message_id: activeReply ? activeReply.id : null,
        reply_to: activeReply,
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

      // Clear replyingTo immediately upon sending
      setReplyingTo(null);

      // Append optimistic message
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        await messageService.sendMessage({
          id: messageId,
          conversationId,
          senderId: currentUserId,
          content: trimmed,
          type: 'text',
          replyToMessageId: activeReply ? activeReply.id : null,
        });

        // Mark as sent
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'sent' } : m))
        );
      } catch (err) {
        console.error('[useChatMessages] Send message error:', err);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: 'failed' } : m))
        );
      }
    },
    [conversationId, currentUserId, currentUserProfile, replyingTo]
  );

  // 4. Retry failed message
  const retryMessage = useCallback(
    async (messageId: string) => {
      const target = messagesRef.current.find((m) => m.id === messageId);
      if (!target || !target.content || !currentUserId) return;

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
          replyToMessageId: target.reply_to_message_id,
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

  // 6. Reply Actions
  const startReply = useCallback((message: ChatMessage) => {
    setReplyingTo({
      id: message.id,
      sender_id: message.sender_id,
      sender_name: message.sender?.display_name || 'Người dùng',
      content: message.content,
      type: message.type,
      is_deleted: Boolean(message.deleted_at),
    });
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // 7. Jump to original message & trigger brief highlight
  const jumpToMessage = useCallback(
    async (targetMessageId: string) => {
      // 1. Check if already in loaded messages
      const existing = messagesRef.current.find((m) => m.id === targetMessageId);

      const triggerHighlight = (id: string) => {
        setHighlightedMessageId(id);

        // Smooth scroll to element
        setTimeout(() => {
          const el = document.getElementById(`msg-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);

        // Remove highlight after 1.8s
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedMessageId(null);
        }, 1800);
      };

      if (existing) {
        triggerHighlight(targetMessageId);
        return;
      }

      // 2. Not in state yet: load older history up to target message
      if (messagesRef.current.length > 0) {
        const oldest = messagesRef.current[0];
        const res = await messageService.getMessagesUpTo(
          conversationId,
          targetMessageId,
          oldest.created_at
        );

        if (res.found && res.messages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = res.messages.filter((m) => !existingIds.has(m.id));
            return [...fresh, ...prev];
          });
          triggerHighlight(targetMessageId);
        }
      }
    },
    [conversationId]
  );

  return {
    messages,
    isLoading,
    isLoadingOlder,
    hasMore,
    error,
    replyingTo,
    highlightedMessageId,
    sendMessage,
    retryMessage,
    loadOlderMessages,
    startReply,
    cancelReply,
    jumpToMessage,
  };
}
