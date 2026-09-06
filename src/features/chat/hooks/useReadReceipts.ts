import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { messageService } from '../../../services/messageService';
import type { ChatMessage, ReadReceiptUser } from '../types';

interface UseReadReceiptsProps {
  conversationId: string;
  currentUserId?: string;
  messages: ChatMessage[];
}

export function useReadReceipts({
  conversationId,
  currentUserId,
  messages,
}: UseReadReceiptsProps) {
  // Track active window/tab visibility
  const [isActivelyVisible, setIsActivelyVisible] = useState<boolean>(() => {
    return typeof document !== 'undefined' && document.visibilityState === 'visible' && document.hasFocus();
  });

  // Track message IDs already marked as read in this session to prevent repeated requests
  const markedReadIdsRef = useRef<Set<string>>(new Set());

  // Queue of message IDs waiting to be flushed in a batch
  const pendingQueueRef = useRef<Set<string>>(new Set());
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Monitor tab visibility and focus
  useEffect(() => {
    const handleVisibilityOrFocusChange = () => {
      const active = document.visibilityState === 'visible' && document.hasFocus();
      setIsActivelyVisible(active);
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocusChange);
    window.addEventListener('focus', handleVisibilityOrFocusChange);
    window.addEventListener('blur', handleVisibilityOrFocusChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityOrFocusChange);
      window.removeEventListener('focus', handleVisibilityOrFocusChange);
      window.removeEventListener('blur', handleVisibilityOrFocusChange);
    };
  }, []);

  // 2. Batch flush function
  const flushBatch = useCallback(() => {
    if (!currentUserId || pendingQueueRef.current.size === 0) return;

    const idsToMark = Array.from(pendingQueueRef.current);
    pendingQueueRef.current.clear();

    for (const id of idsToMark) {
      markedReadIdsRef.current.add(id);
    }

    messageService.markMessagesAsRead(idsToMark, currentUserId).catch((err) => {
      console.warn('[useReadReceipts] Batch mark read error:', err);
    });
  }, [currentUserId]);

  // 3. Queue unread messages when conversation is actively visible
  useEffect(() => {
    if (!isActivelyVisible || !currentUserId || messages.length === 0) return;

    let hasNewToMark = false;

    for (const msg of messages) {
      // Don't mark our own messages (we wrote them)
      if (msg.sender_id === currentUserId) continue;

      // Check if already read according to DB or local session
      const alreadyReadInDb = msg.reads?.some((r) => r.user_id === currentUserId);
      const alreadyMarkedLocally = markedReadIdsRef.current.has(msg.id);

      if (!alreadyReadInDb && !alreadyMarkedLocally) {
        pendingQueueRef.current.add(msg.id);
        hasNewToMark = true;
      }
    }

    if (hasNewToMark) {
      // Debounce batch flush by 500ms
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      flushTimeoutRef.current = setTimeout(() => {
        flushBatch();
      }, 500);
    }

    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, [messages, isActivelyVisible, currentUserId, flushBatch]);

  // Reset marked IDs and pending queue when conversation changes
  useEffect(() => {
    markedReadIdsRef.current.clear();
    pendingQueueRef.current.clear();
  }, [conversationId]);

  // Flush remaining on unmount
  useEffect(() => {
    return () => {
      flushBatch();
    };
  }, [flushBatch]);

  // 4. Compute Messenger-style latest read avatars per message
  // For each user (other than current user), find the latest message they have read
  const readersByMessageId = useMemo(() => {
    const lastReadMsgByUser = new Map<string, { msgId: string; user: ReadReceiptUser }>();

    // Messages are in chronological order (oldest -> newest)
    for (const msg of messages) {
      if (!msg.reads) continue;

      for (const r of msg.reads) {
        // Skip current user (we don't show our own tiny avatar as a read receipt to ourselves)
        if (r.user_id === currentUserId) continue;

        // Since messages are chronological, later iterations overwrite with the latest message read
        lastReadMsgByUser.set(r.user_id, {
          msgId: msg.id,
          user: r,
        });
      }
    }

    // Map each message to the users whose FURTHEST read message is this message
    const resultMap: Record<string, ReadReceiptUser[]> = {};

    for (const [, { msgId, user }] of lastReadMsgByUser) {
      if (!resultMap[msgId]) {
        resultMap[msgId] = [];
      }
      resultMap[msgId].push(user);
    }

    return resultMap;
  }, [messages, currentUserId]);

  return {
    isActivelyVisible,
    readersByMessageId,
    flushBatch,
  };
}
