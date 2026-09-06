import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ChatMessage, ReadReceiptUser } from '../types';
import { MessageRow } from './MessageRow';
import { Spinner } from '../../../components/ui/Spinner';
import { Avatar } from '../../../components/ui/Avatar';

interface VirtualizedMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isGroupConversation: boolean;
  conversationName?: string | null;
  conversationAvatar?: string | null;
  isLoadingOlder: boolean;
  hasMore: boolean;
  highlightedMessageId?: string | null;
  readersByMessageId?: Record<string, ReadReceiptUser[]>;
  onLoadOlder: () => Promise<boolean>;
  onRetryMessage?: (messageId: string) => void;
  onReplyMessage?: (message: ChatMessage) => void;
  onJumpToMessage?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onOpenReactionViewer?: (message: ChatMessage) => void;
}

const isSameDay = (d1: string, d2: string): boolean => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  currentUserId,
  isGroupConversation,
  conversationName,
  conversationAvatar,
  isLoadingOlder,
  hasMore,
  highlightedMessageId,
  readersByMessageId,
  onLoadOlder,
  onRetryMessage,
  onReplyMessage,
  onJumpToMessage,
  onToggleReaction,
  onOpenReactionViewer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [hasNewUnseenMessage, setHasNewUnseenMessage] = useState(false);

  // State to track scroll measurements for backward pagination
  const scrollHeightBeforeRef = useRef<number>(0);
  const scrollTopBeforeRef = useRef<number>(0);
  const isPrependingRef = useRef<boolean>(false);
  const prevMessagesLengthRef = useRef<number>(0);

  // Helper to check if user is scrolled near bottom (within 120px)
  const isNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  // Scroll to bottom smoothly or instantly
  const scrollToBottom = useCallback((smooth = true) => {
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
      setShowScrollBottom(false);
      setHasNewUnseenMessage(false);
    }
  }, []);

  // 1. Initial scroll to bottom on mount once messages are first loaded
  const hasInitializedScrollRef = useRef(false);
  useLayoutEffect(() => {
    if (messages.length > 0 && !hasInitializedScrollRef.current) {
      scrollToBottom(false);
      hasInitializedScrollRef.current = true;
    }
  }, [messages.length, scrollToBottom]);

  // 2. Handle scroll position retention when older messages are prepended
  useLayoutEffect(() => {
    if (isPrependingRef.current && containerRef.current) {
      const container = containerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - scrollHeightBeforeRef.current;

      // Restore position precisely so the viewport doesn't shift
      container.scrollTop = scrollTopBeforeRef.current + heightDifference;
      isPrependingRef.current = false;
    }
  }, [messages]);

  // 3. Handle incoming or new outgoing messages
  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const currLength = messages.length;
    prevMessagesLengthRef.current = currLength;

    if (currLength <= prevLength || isPrependingRef.current) return;

    const latestMessage = messages[currLength - 1];
    const isFromSelf = latestMessage?.sender_id === currentUserId;

    if (isFromSelf || isNearBottom()) {
      // Auto scroll down if user sent it or is already at bottom
      scrollToBottom(true);
    } else {
      // User is reading history, show pill
      setHasNewUnseenMessage(true);
      setShowScrollBottom(true);
    }
  }, [messages, currentUserId, isNearBottom, scrollToBottom]);

  // 4. Scroll listener for backward pagination & floating button
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBottom(!nearBottom);
    if (nearBottom) {
      setHasNewUnseenMessage(false);
    }

    // Trigger backward pagination when scrolled near top
    if (el.scrollTop < 80 && hasMore && !isLoadingOlder && !isPrependingRef.current) {
      scrollHeightBeforeRef.current = el.scrollHeight;
      scrollTopBeforeRef.current = el.scrollTop;
      isPrependingRef.current = true;

      onLoadOlder().catch(() => {
        isPrependingRef.current = false;
      });
    }
  }, [hasMore, isLoadingOlder, onLoadOlder]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
      {/* Scrollable Message History Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain px-1 py-3"
      >
        {/* Top Loading Indicator for Backward Pagination */}
        {isLoadingOlder && (
          <div className="flex items-center justify-center py-3">
            <Spinner size="sm" />
            <span className="text-xs text-slate-400 ml-2">Đang tải tin nhắn cũ...</span>
          </div>
        )}

        {/* Start of Conversation Banner (when all history is loaded) */}
        {!hasMore && (
          <div className="flex flex-col items-center justify-center text-center my-6 px-4 animate-in fade-in-50 duration-300">
            <div className="relative mb-3 p-1 rounded-full ring-2 ring-brand-500/20 shadow-md">
              <Avatar
                src={conversationAvatar}
                name={conversationName || 'User'}
                size="2xl"
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-0.5">
              {conversationName || 'Cuộc trò chuyện'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              {isGroupConversation
                ? 'Đây là điểm bắt đầu của nhóm trò chuyện.'
                : 'Hai bạn đã được kết nối. Hãy gửi lời chào đầu tiên!'}
            </p>
          </div>
        )}

        {/* Rendered Messages List with Grouping */}
        <div className="flex flex-col w-full">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender_id === currentUserId;

            const prevMsg = index > 0 ? messages[index - 1] : null;
            const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;

            const isSameSenderAsPrev = prevMsg?.sender_id === msg.sender_id;
            const isSameDayAsPrev = prevMsg ? isSameDay(prevMsg.created_at, msg.created_at) : false;

            const isSameSenderAsNext = nextMsg?.sender_id === msg.sender_id;
            const isSameDayAsNext = nextMsg ? isSameDay(nextMsg.created_at, msg.created_at) : false;

            const isFirstInGroup = !isSameSenderAsPrev || !isSameDayAsPrev;
            const isLastInGroup = !isSameSenderAsNext || !isSameDayAsNext;
            const showDateSeparator = index === 0 || !isSameDayAsPrev;

            return (
              <MessageRow
                key={msg.id}
                message={msg}
                isCurrentUser={isCurrentUser}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                isGroupConversation={isGroupConversation}
                showDateSeparator={showDateSeparator}
                isHighlighted={msg.id === highlightedMessageId}
                readers={readersByMessageId?.[msg.id]}
                onRetry={onRetryMessage}
                onReply={onReplyMessage}
                onJumpToMessage={onJumpToMessage}
                onToggleReaction={onToggleReaction}
                onOpenReactionViewer={onOpenReactionViewer}
              />
            );
          })}
        </div>

        {/* Bottom Anchor for auto-scroll */}
        <div ref={bottomAnchorRef} className="h-px w-full shrink-0" />
      </div>

      {/* Floating "Tin nhắn mới" / Scroll to bottom pill button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 text-xs font-semibold shadow-lg shadow-black/10 border border-slate-200/80 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          {hasNewUnseenMessage && (
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          )}
          <span>{hasNewUnseenMessage ? 'Tin nhắn mới' : 'Xuống cuối'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
