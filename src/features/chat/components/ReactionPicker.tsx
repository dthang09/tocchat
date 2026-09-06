import React, { useEffect, useRef } from 'react';
import { QUICK_REACTIONS } from '../types';
import { cn } from '../../../utils/cn';

interface ReactionPickerProps {
  currentReaction?: string | null;
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  currentReaction,
  onSelectReaction,
  onClose,
  position = 'top-right',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute z-40 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full shadow-xl border border-slate-200/80 dark:border-slate-800 animate-in zoom-in-90 fade-in-0 duration-150 select-none',
        position === 'top-right' && '-top-11 right-0',
        position === 'top-left' && '-top-11 left-0',
        position === 'bottom-right' && '-bottom-11 right-0',
        position === 'bottom-left' && '-bottom-11 left-0'
      )}
    >
      {QUICK_REACTIONS.map((emoji) => {
        const isSelected = currentReaction === emoji;

        return (
          <button
            key={emoji}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectReaction(emoji);
              onClose();
            }}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-125 active:scale-95 transition-all duration-150 cursor-pointer',
              isSelected && 'bg-brand-100 dark:bg-brand-950/60 ring-2 ring-brand-500 scale-110'
            )}
            title={isSelected ? `Bỏ biểu cảm ${emoji}` : `Thả biểu cảm ${emoji}`}
          >
            <span>{emoji}</span>
          </button>
        );
      })}
    </div>
  );
};
