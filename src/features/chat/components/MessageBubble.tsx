import React from 'react';
import { AlertCircle, RotateCcw, Clock } from 'lucide-react';
import type { ChatMessage } from '../types';
import { cn } from '../../../utils/cn';

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  onRetry?: (messageId: string) => void;
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
  ({ message, isCurrentUser, onRetry, showTimestamp = true }) => {
    const isSending = message.status === 'sending';
    const isFailed = message.status === 'failed';
    const timeText = formatMessageTime(message.created_at);

    return (
      <div className="flex flex-col">
        <div
          className={cn(
            'relative px-3.5 py-2 max-w-[82vw] sm:max-w-[420px] rounded-2xl text-[14.5px] leading-relaxed break-words transition-opacity',
            isCurrentUser
              ? 'bg-brand-600 text-white rounded-br-xs self-end'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs self-start',
            isSending && 'opacity-70'
          )}
        >
          {/* Message Content */}
          <span className="whitespace-pre-wrap select-text">{message.content}</span>

          {/* Inline or subtle indicators */}
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
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[11px] font-semibold active:scale-95 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                Thử lại
              </button>
            )}
          </div>
        )}

        {/* Other User Timestamp (displayed below bubble if requested) */}
        {!isCurrentUser && showTimestamp && (
          <span className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 ml-1 self-start select-none">
            {timeText}
          </span>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
