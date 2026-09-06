import React from 'react';
import type { TypingUser } from '../types';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  typingText: string | null;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  typingText,
  className,
}) => {
  if (!typingUsers || typingUsers.length === 0 || !typingText) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3 py-1.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-150 select-none',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Clustered tiny avatars of users currently typing */}
      <div className="flex items-center -space-x-1.5 shrink-0">
        {typingUsers.slice(0, 3).map((u) => (
          <div
            key={u.userId}
            className="w-5 h-5 rounded-full ring-1.5 ring-white dark:ring-slate-900 overflow-hidden shadow-2xs"
          >
            <Avatar
              src={u.avatarUrl}
              name={u.userName}
              size="xs"
              className="w-full h-full text-[9px]"
            />
          </div>
        ))}
        {typingUsers.length > 3 && (
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 ring-1.5 ring-white dark:ring-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-2xs">
            +{typingUsers.length - 3}
          </div>
        )}
      </div>

      {/* Messenger-style 3-dots animated bubble */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 px-2.5 py-1.5 rounded-2xl rounded-bl-sm shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-400 animate-bounce" />
      </div>

      {/* Formatted text description */}
      <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-[200px] sm:max-w-xs">
        {typingText}
      </span>
    </div>
  );
};
