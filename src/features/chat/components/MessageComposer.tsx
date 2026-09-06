import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Reply, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { ReplyPreview } from '../types';

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
  replyingTo?: ReplyPreview | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  replyingTo,
  onCancelReply,
  disabled = false,
  placeholder = 'Nhập tin nhắn...',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input when a reply target is chosen
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  // Auto-resize textarea height as text grows up to 5 lines (~120px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shrink-0 pb-safe">
      <div className="max-w-4xl mx-auto">
        {/* Reply Preview Banner above composer */}
        {replyingTo && (
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-1 h-7 rounded-full bg-brand-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <Reply className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 truncate">
                    Đang trả lời {replyingTo.sender_name || 'Người dùng'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {replyingTo.content || 'Tin nhắn'}
                </p>
              </div>
            </div>

            {/* Cancel Reply Button */}
            {onCancelReply && (
              <button
                onClick={onCancelReply}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 ml-2 cursor-pointer"
                title="Hủy trả lời"
                aria-label="Hủy trả lời"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Input & Send Button Container */}
        <div className="p-2.5 sm:p-3 flex items-end gap-2">
          {/* Input container */}
          <div className="flex-1 min-h-[42px] max-h-[120px] bg-slate-100 dark:bg-slate-900 rounded-2xl px-3.5 py-2 flex items-center focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              className="w-full bg-transparent resize-none border-none outline-hidden text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed max-h-[110px] overflow-y-auto no-scrollbar"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Gửi tin nhắn"
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-150',
              canSend
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 active:scale-95 hover:bg-brand-500 cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            )}
          >
            <SendHorizonal className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
