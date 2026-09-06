import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { messageService } from '../../../services/messageService';
import type { TypingBroadcastPayload, TypingUser } from '../types';

interface UseTypingProps {
  conversationId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string | null;
}

export function useTyping({
  conversationId,
  currentUserId,
  currentUserName = 'Người dùng',
  currentUserAvatar = null,
}: UseTypingProps) {
  // Map of userId -> { user: TypingUser, timeoutId: ReturnType<typeof setTimeout> }
  const [typingMap, setTypingMap] = useState<Map<string, TypingUser>>(new Map());
  const expirationTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Outgoing typing throttle and idle timers
  const lastSentTypingTimeRef = useRef<number>(0);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef<boolean>(false);

  // Clear incoming timers and outgoing state when switching conversations
  useEffect(() => {
    // Clear all incoming expiration timers
    for (const timeoutId of expirationTimersRef.current.values()) {
      clearTimeout(timeoutId);
    }
    expirationTimersRef.current.clear();
    setTypingMap(new Map());

    // Clear outgoing state
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
    isTypingSentRef.current = false;
    lastSentTypingTimeRef.current = 0;
  }, [conversationId]);

  // Handle incoming broadcast typing event
  const handleIncomingTyping = useCallback(
    (payload: TypingBroadcastPayload) => {
      if (!payload || !payload.userId || payload.userId === currentUserId) return;

      const { userId, userName, avatarUrl, isTyping } = payload;

      // Clear existing auto-expiration timer for this user
      const existingTimer = expirationTimersRef.current.get(userId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        expirationTimersRef.current.delete(userId);
      }

      if (isTyping) {
        // Set new auto-expiration timer (3.5s)
        const timeoutId = setTimeout(() => {
          setTypingMap((prev) => {
            const next = new Map(prev);
            next.delete(userId);
            return next;
          });
          expirationTimersRef.current.delete(userId);
        }, 3500);

        expirationTimersRef.current.set(userId, timeoutId);

        setTypingMap((prev) => {
          const next = new Map(prev);
          next.set(userId, {
            userId,
            userName: userName || 'Người dùng',
            avatarUrl: avatarUrl || null,
            lastTypedAt: Date.now(),
          });
          return next;
        });
      } else {
        // Remove user immediately
        setTypingMap((prev) => {
          if (!prev.has(userId)) return prev;
          const next = new Map(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    [currentUserId]
  );

  // Send outgoing typing indicator
  const sendOutgoingTyping = useCallback(
    (isTyping: boolean) => {
      if (!conversationId || !currentUserId) return;

      messageService.sendTypingIndicator(conversationId, {
        userId: currentUserId,
        userName: currentUserName,
        avatarUrl: currentUserAvatar,
        isTyping,
      });

      isTypingSentRef.current = isTyping;
      if (isTyping) {
        lastSentTypingTimeRef.current = Date.now();
      }
    },
    [conversationId, currentUserId, currentUserName, currentUserAvatar]
  );

  // Called whenever user types in the input
  const handleUserTyping = useCallback(() => {
    if (!conversationId || !currentUserId) return;

    const now = Date.now();
    const timeSinceLastSent = now - lastSentTypingTimeRef.current;

    // Send broadcast immediately on first keystroke or if throttle window (2s) passed
    if (!isTypingSentRef.current || timeSinceLastSent > 2000) {
      sendOutgoingTyping(true);
    }

    // Reset idle timer (2.5s)
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      sendOutgoingTyping(false);
      idleTimeoutRef.current = null;
    }, 2500);
  }, [conversationId, currentUserId, sendOutgoingTyping]);

  // Called when user sends message or clears input or blurs
  const stopUserTyping = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
    if (isTypingSentRef.current) {
      sendOutgoingTyping(false);
    }
  }, [sendOutgoingTyping]);

  // Cleanup on unmount
  useEffect(() => {
    const timers = expirationTimersRef.current;
    return () => {
      for (const t of timers.values()) {
        clearTimeout(t);
      }
      timers.clear();

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (isTypingSentRef.current) {
        sendOutgoingTyping(false);
      }
    };
  }, [sendOutgoingTyping]);

  // Formatted list of typing users
  const typingUsers = useMemo(() => {
    return Array.from(typingMap.values());
  }, [typingMap]);

  // Formatted display text according to specification:
  // - "Nam đang nhập..."
  // - "Nam và Minh đang nhập..."
  // - "3 người đang nhập..."
  const typingText = useMemo(() => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} đang nhập...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} và ${typingUsers[1].userName} đang nhập...`;
    }
    return `${typingUsers.length} người đang nhập...`;
  }, [typingUsers]);

  return {
    typingUsers,
    typingText,
    handleIncomingTyping,
    handleUserTyping,
    stopUserTyping,
  };
}
