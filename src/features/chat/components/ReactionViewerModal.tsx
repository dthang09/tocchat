import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ChatMessage, ReactionGroup } from '../types';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

interface ReactionViewerModalProps {
  message: ChatMessage;
  currentUserId?: string;
  onRemoveReaction: (emoji: string) => void;
  onClose: () => void;
}

export const ReactionViewerModal: React.FC<ReactionViewerModalProps> = ({
  message,
  currentUserId,
  onRemoveReaction,
  onClose,
}) => {
  const reactions: ReactionGroup[] = message.reactions || [];
  const totalCount = reactions.reduce((sum, g) => sum + g.count, 0);

  // Active filter tab: 'all' or specific emoji
  const [selectedEmoji, setSelectedEmoji] = useState<string>('all');

  // Filter users based on selected tab
  const displayedUsers =
    selectedEmoji === 'all'
      ? reactions.flatMap((g) => g.users)
      : reactions.find((g) => g.emoji === selectedEmoji)?.users || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[75vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Cảm xúc ({totalCount})
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reaction Filter Tabs */}
        {reactions.length > 1 && (
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedEmoji('all')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer',
                selectedEmoji === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              Tất cả {totalCount}
            </button>
            {reactions.map((g) => (
              <button
                key={g.emoji}
                onClick={() => setSelectedEmoji(g.emoji)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer',
                  selectedEmoji === g.emoji
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <span>{g.emoji}</span>
                <span>{g.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Users List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
          {displayedUsers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Chưa có ai bày tỏ cảm xúc.
            </div>
          ) : (
            displayedUsers.map((u, idx) => {
              const isMe = u.user_id === currentUserId;

              return (
                <div
                  key={`${u.user_id}-${u.emoji}-${idx}`}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Avatar src={u.avatar_url} name={u.user_name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {u.user_name}
                        {isMe && (
                          <span className="text-brand-600 dark:text-brand-400 ml-1 font-normal">
                            (Bạn)
                          </span>
                        )}
                      </p>
                      {isMe && (
                        <p className="text-[10px] text-slate-400">Nhấn biểu tượng để gỡ</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isMe) {
                        onRemoveReaction(u.emoji);
                        onClose();
                      }
                    }}
                    className={cn(
                      'text-xl p-1 rounded-full transition-transform',
                      isMe ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
                    )}
                    title={isMe ? 'Nhấn để gỡ cảm xúc' : undefined}
                  >
                    {u.emoji}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
