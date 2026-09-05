import React from 'react';
import { Users } from 'lucide-react';
import type { ConversationWithDetails } from '../services/conversationService';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

export interface ConversationRowProps {
  conversation: ConversationWithDetails;
  onClick: () => void;
  className?: string;
}

function formatConversationTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes}p`;
  if (diffHours < 24) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày`;

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export const ConversationRow: React.FC<ConversationRowProps> = ({
  conversation,
  onClick,
  className,
}) => {
  const isGroup = conversation.type === 'group';
  const name = conversation.name || (isGroup ? 'Nhóm chưa đặt tên' : 'Người dùng TocChat');
  const avatarUrl = conversation.avatar_url;
  const timeText = formatConversationTime(conversation.updated_at || conversation.created_at);

  // Secondary preview area (strictly no fake last messages!)
  const previewText = isGroup
    ? `Nhóm • ${conversation.memberCount} thành viên`
    : 'Cuộc trò chuyện mới';

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full min-h-[68px] px-3.5 py-2.5 flex items-center gap-3.5 rounded-2xl cursor-pointer select-none transition-all duration-150',
        'hover:bg-slate-100/80 dark:hover:bg-slate-900/70 active:scale-[0.99] active:bg-slate-200/60 dark:active:bg-slate-800/60',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Circular Avatar */}
      <div className="relative shrink-0">
        <Avatar
          src={avatarUrl}
          name={name}
          size="xl"
          isOnline={true}
          showOnlineDot={!isGroup}
        />
        {isGroup && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 ring-2 ring-white dark:ring-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Users className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Name and secondary preview */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {name}
          </h3>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
            {timeText}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {previewText}
          </p>
        </div>
      </div>
    </div>
  );
};
