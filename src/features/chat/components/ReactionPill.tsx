import React from 'react';
import type { ReactionGroup } from '../types';
import { cn } from '../../../utils/cn';

interface ReactionPillProps {
  reactions: ReactionGroup[];
  isCurrentUser: boolean;
  onClick: () => void;
}

export const ReactionPill: React.FC<ReactionPillProps> = ({
  reactions,
  isCurrentUser,
  onClick,
}) => {
  if (!reactions || reactions.length === 0) return null;

  const totalCount = reactions.reduce((sum, g) => sum + g.count, 0);
  const hasUserReacted = reactions.some((g) => g.hasReacted);

  // Show up to 3 distinct emojis
  const topEmojis = reactions.slice(0, 3).map((g) => g.emoji);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title="Xem ai đã bày tỏ cảm xúc"
      aria-label={`Xem ${totalCount} cảm xúc`}
      className={cn(
        'relative -mt-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-xs select-none backdrop-blur-xs transition-all cursor-pointer hover:scale-105 active:scale-95',
        isCurrentUser ? 'self-end mr-1.5' : 'self-start ml-1.5',
        hasUserReacted
          ? 'bg-brand-50 dark:bg-brand-950/80 border border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300'
          : 'bg-white/95 dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
      )}
    >
      <span className="flex items-center -space-x-0.5 text-xs">
        {topEmojis.map((emoji, idx) => (
          <span key={idx}>{emoji}</span>
        ))}
      </span>

      {totalCount > 1 && (
        <span className="text-[11px] font-bold leading-none ml-0.5">
          {totalCount}
        </span>
      )}
    </button>
  );
};
