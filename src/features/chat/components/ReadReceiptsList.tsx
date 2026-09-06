import React, { useState } from 'react';
import type { ReadReceiptUser } from '../types';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

interface ReadReceiptsListProps {
  readers: ReadReceiptUser[];
  isCurrentUser: boolean;
}

export const ReadReceiptsList: React.FC<ReadReceiptsListProps> = React.memo(
  ({ readers, isCurrentUser }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!readers || readers.length === 0) return null;

    const names = readers.map((r) => r.user_name).join(', ');

    return (
      <div
        className={cn(
          'relative flex items-center gap-0.5 mt-0.5 mb-1 select-none transition-all',
          isCurrentUser ? 'justify-end pr-1' : 'justify-start pl-9'
        )}
      >
        <div
          onClick={() => setShowTooltip((v) => !v)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center -space-x-1.5 cursor-pointer py-0.5"
          title={`Đã xem bởi ${names}`}
        >
          {readers.slice(0, 5).map((reader) => (
            <div
              key={reader.user_id}
              className="w-4 h-4 rounded-full ring-1.5 ring-white dark:ring-slate-900 overflow-hidden shadow-2xs hover:scale-125 transition-transform"
            >
              <Avatar
                src={reader.avatar_url}
                name={reader.user_name}
                size="xs"
                className="w-full h-full text-[8px]"
              />
            </div>
          ))}

          {readers.length > 5 && (
            <span className="text-[9px] font-bold text-slate-400 pl-1">
              +{readers.length - 5}
            </span>
          )}
        </div>

        {/* Floating Tooltip */}
        {showTooltip && (
          <div
            className={cn(
              'absolute bottom-5 z-30 px-2 py-1 bg-slate-900/90 dark:bg-slate-800/90 text-white text-[10px] font-medium rounded-lg shadow-md whitespace-nowrap animate-in fade-in-0 duration-100 backdrop-blur-xs',
              isCurrentUser ? 'right-0' : 'left-9'
            )}
          >
            Đã xem bởi {names}
          </div>
        )}
      </div>
    );
  }
);

ReadReceiptsList.displayName = 'ReadReceiptsList';
