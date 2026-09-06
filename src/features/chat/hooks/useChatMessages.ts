import { useState, useEffect, useRef, useCallback } from 'react';
import { messageService } from '../../../services/messageService';
import { useReadReceipts } from './useReadReceipts';
import { useTyping } from './useTyping';
import type { ChatMessage, ChatSender, ReplyPreview, ReactionGroup, ReactionUser, ReadReceiptUser } from '../types';
import type { Message, MessageReaction, MessageRead } from '../../../types';

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

  // Reaction viewer modal state
  const [reactionViewerMessage, setReactionViewerMessage] = useState<ChatMessage | null>(null);

  // Jump-to highlight state
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref of messages for realtime event deduplication without stale state
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const membersMapRef = useRef(membersMap);
  membersMapRef.current = membersMap;

  // Ephemeral broadcast typing indicators
  const {
    typingUsers,
    typingText,
    handleIncomingTyping,
    handleUserTyping,
    stopUserTyping,
  } = useTyping({
    conversationId,
    currentUserId,
    currentUserName: currentUserProfile?.display_name || 'Người dùng',
    currentUserAvatar: currentUserProfile?.avatar_url,
  });

  // 1. Initial Load of latest messages
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setMessages([]);
    setReplyingTo(null);
    setHighlightedMessageId(null);
    setReactionViewerMessage(null);

    messageService
      .getLatestMessages(conversationId, 40, currentUserId)
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
  }, [conversationId, currentUserId]);

  // 2. Realtime subscription for incoming messages & reactions
  useEffect(() => {
    if (!conversationId) return;

    const handleIncomingMessage = async (newMsg: Message) => {
      const existing = messagesRef.current.find((m) => m.id === newMsg.id);

      if (existing) {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'sent' } : m))
        );
        return;
      }

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
        reactions: [],
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === formatted.id)) {
          return prev;
        }
        return [...prev, formatted];
      });
    };

    const handleReactionInsert = async (r: MessageReaction) => {
      // Check if message is currently in view
      const targetMsg = messagesRef.current.find((m) => m.id === r.message_id);
      if (!targetMsg) return;

      // Resolve user details
      let userName = 'Người dùng';
      let avatarUrl: string | null = null;

      if (r.user_id === currentUserId) {
        userName = currentUserProfile?.display_name || 'Tôi';
        avatarUrl = currentUserProfile?.avatar_url || null;
      } else if (membersMapRef.current[r.user_id]) {
        userName = membersMapRef.current[r.user_id].display_name || 'Người dùng';
        avatarUrl = membersMapRef.current[r.user_id].avatar_url || null;
      } else {
        const p = await messageService.getSenderProfile(r.user_id);
        if (p?.display_name) userName = p.display_name;
        if (p?.avatar_url) avatarUrl = p.avatar_url;
      }

      const reactionUser: ReactionUser = {
        user_id: r.user_id,
        user_name: userName,
        avatar_url: avatarUrl,
        emoji: r.emoji,
      };

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== r.message_id) return msg;

          // Remove any existing reaction from this user on this message (single reaction model)
          const cleanedGroups: ReactionGroup[] = (msg.reactions || [])
            .map((g) => ({
              ...g,
              users: g.users.filter((u) => u.user_id !== r.user_id),
            }))
            .filter((g) => g.users.length > 0)
            .map((g) => ({
              ...g,
              count: g.users.length,
              hasReacted: g.users.some((u) => u.user_id === currentUserId),
            }));

          // Add to target emoji group
          const targetGroupIndex = cleanedGroups.findIndex((g) => g.emoji === r.emoji);
          if (targetGroupIndex >= 0) {
            const group = cleanedGroups[targetGroupIndex];
            const updatedUsers = [...group.users, reactionUser];
            cleanedGroups[targetGroupIndex] = {
              ...group,
              count: updatedUsers.length,
              hasReacted: updatedUsers.some((u) => u.user_id === currentUserId),
              users: updatedUsers,
            };
          } else {
            cleanedGroups.push({
              emoji: r.emoji,
              count: 1,
              hasReacted: r.user_id === currentUserId,
              users: [reactionUser],
            });
          }

          const updatedMsg = {
            ...msg,
            reactions: cleanedGroups,
          };

          // Also keep modal in sync if it's open for this message
          setReactionViewerMessage((curr) => (curr?.id === msg.id ? updatedMsg : curr));

          return updatedMsg;
        })
      );
    };

    const handleReactionDelete = (r: MessageReaction) => {
      const targetMsg = messagesRef.current.find((m) => m.id === r.message_id);
      if (!targetMsg) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== r.message_id) return msg;

          const updatedGroups: ReactionGroup[] = (msg.reactions || [])
            .map((g) => {
              if (g.emoji !== r.emoji) return g;
              const filteredUsers = g.users.filter((u) => u.user_id !== r.user_id);
              return {
                ...g,
                count: filteredUsers.length,
                hasReacted: filteredUsers.some((u) => u.user_id === currentUserId),
                users: filteredUsers,
              };
            })
            .filter((g) => g.count > 0);

          const updatedMsg = {
            ...msg,
            reactions: updatedGroups,
          };

          setReactionViewerMessage((curr) => (curr?.id === msg.id ? updatedMsg : curr));

          return updatedMsg;
        })
      );
    };

    const handleReadReceipt = async (rd: MessageRead) => {
      const targetMsg = messagesRef.current.find((m) => m.id === rd.message_id);
      if (!targetMsg) return;

      let userName = 'Người dùng';
      let avatarUrl: string | null = null;
      if (rd.user_id === currentUserId) {
        userName = currentUserProfile?.display_name || 'Tôi';
        avatarUrl = currentUserProfile?.avatar_url || null;
      } else if (membersMapRef.current[rd.user_id]) {
        userName = membersMapRef.current[rd.user_id].display_name || 'Người dùng';
        avatarUrl = membersMapRef.current[rd.user_id].avatar_url || null;
      } else {
        const p = await messageService.getSenderProfile(rd.user_id);
        if (p) {
          userName = p.display_name || 'Người dùng';
          avatarUrl = p.avatar_url || null;
        }
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== rd.message_id) return msg;

          if (msg.reads?.some((r) => r.user_id === rd.user_id)) {
            return msg;
          }

          const newRead: ReadReceiptUser = {
            user_id: rd.user_id,
            user_name: userName,
            avatar_url: avatarUrl,
            read_at: rd.read_at,
          };

          return {
            ...msg,
            reads: [...(msg.reads || []), newRead],
          };
        })
      );
    };

    const unsubscribe = messageService.subscribeToConversation(conversationId, {
      onNewMessage: handleIncomingMessage,
      onReactionInsert: handleReactionInsert,
      onReactionDelete: handleReactionDelete,
      onReadReceipt: handleReadReceipt,
      onTyping: handleIncomingTyping,
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId, currentUserId, currentUserProfile, handleIncomingTyping]);

  // 3. Send message with optimistic update & reply support
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !conversationId || !currentUserId) return;

      stopUserTyping();

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
        reactions: [],
        sender: {
          id: currentUserId,
          display_name: currentUserProfile?.display_name || 'Tôi',
          avatar_url: currentUserProfile?.avatar_url || null,
        },
      };

      setReplyingTo(null);
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
    [conversationId, currentUserId, currentUserProfile, replyingTo, stopUserTyping]
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
        40,
        currentUserId
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
  }, [conversationId, hasMore, isLoadingOlder, currentUserId]);

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

  // 7. Reaction Actions: Add, Remove, or Change
  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!currentUserId) return;

      const target = messagesRef.current.find((m) => m.id === messageId);
      if (!target) return;

      // Find user's existing reaction on this message if any
      let existingUserEmoji: string | null = null;
      for (const g of target.reactions || []) {
        if (g.users.some((u) => u.user_id === currentUserId)) {
          existingUserEmoji = g.emoji;
          break;
        }
      }

      const currentUserReactionObj: ReactionUser = {
        user_id: currentUserId,
        user_name: currentUserProfile?.display_name || 'Tôi',
        avatar_url: currentUserProfile?.avatar_url || null,
        emoji,
      };

      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;

          let updatedGroups: ReactionGroup[] = (msg.reactions || []).map((g) => ({
            ...g,
            users: g.users.filter((u) => u.user_id !== currentUserId),
          }));

          if (existingUserEmoji === emoji) {
            // Case 1: Removing own reaction
            updatedGroups = updatedGroups
              .filter((g) => g.users.length > 0)
              .map((g) => ({
                ...g,
                count: g.users.length,
                hasReacted: false,
              }));
          } else {
            // Case 2 & 3: Adding new reaction or changing existing
            updatedGroups = updatedGroups.filter((g) => g.users.length > 0);
            const targetGroupIdx = updatedGroups.findIndex((g) => g.emoji === emoji);

            if (targetGroupIdx >= 0) {
              const grp = updatedGroups[targetGroupIdx];
              const updatedUsers = [...grp.users, currentUserReactionObj];
              updatedGroups[targetGroupIdx] = {
                ...grp,
                count: updatedUsers.length,
                hasReacted: true,
                users: updatedUsers,
              };
            } else {
              updatedGroups.push({
                emoji,
                count: 1,
                hasReacted: true,
                users: [currentUserReactionObj],
              });
            }
          }

          const updatedMsg = {
            ...msg,
            reactions: updatedGroups,
          };

          setReactionViewerMessage((curr) => (curr?.id === msg.id ? updatedMsg : curr));

          return updatedMsg;
        })
      );

      // Persist to database
      try {
        if (existingUserEmoji === emoji) {
          // Remove
          await messageService.removeReaction(messageId, currentUserId, emoji);
        } else if (existingUserEmoji) {
          // Change
          await messageService.changeReaction(messageId, currentUserId, existingUserEmoji, emoji);
        } else {
          // Add
          await messageService.addReaction(messageId, currentUserId, emoji);
        }
      } catch (err) {
        console.error('[useChatMessages] toggleReaction error:', err);
        // Rollback by refreshing latest reactions for this message
        // On error, let local state reload on next tick
      }
    },
    [currentUserId, currentUserProfile]
  );

  // 8. Jump to original message & trigger brief highlight
  const jumpToMessage = useCallback(
    async (targetMessageId: string) => {
      const triggerHighlight = (id: string) => {
        setHighlightedMessageId(id);

        setTimeout(() => {
          const el = document.getElementById(`msg-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedMessageId(null);
        }, 1800);
      };

      const existing = messagesRef.current.find((m) => m.id === targetMessageId);
      if (existing) {
        triggerHighlight(targetMessageId);
        return;
      }

      if (messagesRef.current.length > 0) {
        const oldest = messagesRef.current[0];
        const res = await messageService.getMessagesUpTo(
          conversationId,
          targetMessageId,
          oldest.created_at,
          currentUserId
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
    [conversationId, currentUserId]
  );

  // 9. Reusable read receipts management & grouping
  const { readersByMessageId, isActivelyVisible } = useReadReceipts({
    conversationId,
    currentUserId,
    messages,
  });

  return {
    messages,
    isLoading,
    isLoadingOlder,
    hasMore,
    error,
    replyingTo,
    highlightedMessageId,
    reactionViewerMessage,
    readersByMessageId,
    isActivelyVisible,
    typingUsers,
    typingText,
    handleUserTyping,
    stopUserTyping,
    sendMessage,
    retryMessage,
    loadOlderMessages,
    startReply,
    cancelReply,
    toggleReaction,
    jumpToMessage,
    openReactionViewer: setReactionViewerMessage,
    closeReactionViewer: () => setReactionViewerMessage(null),
  };
}
