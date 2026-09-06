import React, { useState, useRef } from 'react';
import { AlertCircle, RotateCcw, Clock, Reply } from 'lucide-react';
import type { ChatMessage } from '../types';
import { cn } from '../../../utils/cn';

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isHighlighted?: boolean;
  onRetry?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onJumpToMessage?: (messageId: string) => void;
  showTimestamp?: boolean;
}

const formatMessageTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({
    message,
    isCurrentUser,
    isHighlighted = false,
    onRetry,
    onReply,
    onJumpToMessage,
    showTimestamp = true,
  }) => {
    const isSending = message.status === 'sending';
    const isFailed = message.status === 'failed';
    const timeText = formatMessageTime(message.created_at);

    // Touch swipe & long-press state
    const [swipeOffset, setSwipeOffset] = useState(0);
    const touchStartXRef = useRef(0);
    const touchStartYRef = useRef(0);
    const isSwipingRef = useRef(false);
    const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      isSwipingRef.current = false;

      // Long-press timer (450ms)
      longPressTimeoutRef.current = setTimeout(() => {
        if (!isSwipingRef.current && onReply) {
          if (navigator.vibrate) navigator.vibrate(30);
          onReply(message);
        }
      }, 450);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartXRef.current;
      const diffY = currentY - touchStartYRef.current;

      // If vertical movement dominant, cancel long press and do not swipe
      if (Math.abs(diffY) > 15 && Math.abs(diffX) < 15) {
        if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        return;
      }

      // Horizontal swipe to reply
      if (Math.abs(diffX) > 20) {
        if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        isSwipingRef.current = true;
        // Dampen swipe distance
        const offset = Math.max(0, Math.min(diffX * 0.6, 60));
        setSwipeOffset(offset);
      }
    };

    const handleTouchEnd = () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      if (swipeOffset >= 35 && onReply) {
        if (navigator.vibrate) navigator.vibrate(30);
        onReply(message);
      }
      setSwipeOffset(0);
      isSwipingRef.current = false;
    };

    return (
      <div className="relative group flex items-center gap-1.5">
        {/* Reply Action Button on Desktop Hover (for Current User - left side of bubble) */}
        {isCurrentUser && onReply && !isFailed && !isSending && (
          <button
            onClick={() => onReply(message)}
            title="Trả lời"
            aria-label="Trả lời tin nhắn"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95 cursor-pointer shrink-0"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Swipe indicator icon behind bubble on mobile swipe */}
        {swipeOffset > 10 && (
          <div
            className="absolute left-0 -ml-7 flex items-center justify-center text-brand-600 dark:text-brand-400 transition-opacity"
            style={{ opacity: Math.min(swipeOffset / 35, 1) }}
          >
            <Reply className="w-4 h-4" />
          </div>
        )}

        {/* Bubble container with touch handlers and transition */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: swipeOffset > 0 ? `translateX(${swipeOffset}px)` : undefined,
            transition: swipeOffset === 0 ? 'transform 0.15s ease-out' : 'none',
          }}
          className="flex flex-col"
        >
          <div
            className={cn(
              'relative px-3.5 py-2 max-w-[82vw] sm:max-w-[420px] rounded-2xl text-[14.5px] leading-relaxed break-words transition-all duration-300',
              isCurrentUser
                ? 'bg-brand-600 text-white rounded-br-xs self-end'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs self-start',
              isSending && 'opacity-70',
              isHighlighted && 'ring-3 ring-brand-400 shadow-md shadow-brand-500/30 scale-[1.02]'
            )}
          >
            {/* Quoted Message Preview inside Reply Bubble */}
            {message.reply_to && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (message.reply_to?.id && onJumpToMessage) {
                    onJumpToMessage(message.reply_to.id);
                  }
                }}
                className={cn(
                  'mb-1.5 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-all active:scale-[0.98]',
                  isCurrentUser
                    ? 'bg-black/15 hover:bg-black/25 text-white border-l-2 border-white/90'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border-l-2 border-brand-500'
                )}
                title="Nhấn để chuyển đến tin nhắn gốc"
              >
                <div className="flex items-center gap-1 font-semibold text-[11px] leading-tight mb-0.5 opacity-90">
                  <Reply className="w-3 h-3 inline-block shrink-0 opacity-75" />
                  <span>{message.reply_to.sender_name || 'Người dùng'}</span>
                </div>
                <p
                  className={cn(
                    'line-clamp-2 text-[11px] leading-snug',
                    message.reply_to.is_deleted ? 'italic opacity-70' : 'opacity-85'
                  )}
                >
                  {message.reply_to.content || 'Tin nhắn'}
                </p>
              </div>
            )}

            {/* Main Message Content */}
            <span className="whitespace-pre-wrap select-text">{message.content}</span>

            {/* Current user inline timestamp and status */}
            {isCurrentUser && (
              <div className="flex items-center justify-end gap-1 mt-0.5 select-none">
                {showTimestamp && (
                  <span
                    className={cn(
                      'text-[10px] leading-none',
                      isCurrentUser ? 'text-brand-200' : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {timeText}
                  </span>
                )}

                {isSending && (
                  <Clock className="w-3 h-3 text-brand-200 animate-pulse inline-block" />
                )}
              </div>
            )}
          </div>

          {/* Failed State Indicator & Retry Button */}
          {isFailed && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-500 self-end select-none">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium">Gửi thất bại</span>
              {onRetry && (
                <button
                  onClick={() => onRetry(message.id)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[11px] font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Thử lại
                </button>
              )}
            </div>
          )}

          {/* Other User Timestamp (displayed below bubble) */}
          {!isCurrentUser && showTimestamp && (
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 ml-1 self-start select-none">
              {timeText}
            </span>
          )}
        </div>

        {/* Reply Action Button on Desktop Hover (for Other User - right side of bubble) */}
        {!isCurrentUser && onReply && !isFailed && !isSending && (
          <button
            onClick={() => onReply(message)}
            title="Trả lời"
            aria-label="Trả lời tin nhắn"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95 cursor-pointer shrink-0"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
