import React from 'react';
import type { ChatMessage, ReadReceiptUser } from '../types';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { ReadReceiptsList } from './ReadReceiptsList';
import { Avatar } from '../../../components/ui/Avatar';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface MessageRowProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isGroupConversation: boolean;
  showDateSeparator: boolean;
  isHighlighted?: boolean;
  readers?: ReadReceiptUser[];
  onRetry?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onJumpToMessage?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onOpenReactionViewer?: (message: ChatMessage) => void;
}

const MessageRowComponent: React.FC<MessageRowProps> = ({
  message,
  isCurrentUser,
  isFirstInGroup,
  isLastInGroup,
  isGroupConversation,
  showDateSeparator,
  isHighlighted = false,
  readers = [],
  onRetry,
  onReply,
  onJumpToMessage,
  onToggleReaction,
  onOpenReactionViewer,
}) => {
  const senderName = message.sender?.display_name || 'Người dùng';
  const senderAvatar = message.sender?.avatar_url;

  return (
    <div id={`msg-${message.id}`} className="flex flex-col w-full scroll-mt-20">
      {/* Date Separator */}
      {showDateSeparator && <DateSeparator dateString={message.created_at} />}

      {/* Row container */}
      <div
        className={cn(
          'flex w-full items-end gap-2 px-3',
          isCurrentUser ? 'justify-end' : 'justify-start',
          isFirstInGroup ? 'mt-2.5' : 'mt-0.5'
        )}
      >
        {/* Other User Avatar Area (Left side) */}
        {!isCurrentUser && (
          <div className="w-7 shrink-0 flex items-end justify-center mb-0.5">
            {isLastInGroup ? (
              <Avatar src={senderAvatar} name={senderName} size="xs" />
            ) : (
              <div className="w-7" />
            )}
          </div>
        )}

        {/* Bubble & Name Area */}
        <div
          className={cn(
            'flex flex-col max-w-[85%]',
            isCurrentUser ? 'items-end' : 'items-start'
          )}
        >
          {/* Sender display name for group conversations (first message in a consecutive group) */}
          {!isCurrentUser && isGroupConversation && isFirstInGroup && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5 ml-1 select-none">
              {senderName}
            </span>
          )}

          <MessageBubble
            message={message}
            isCurrentUser={isCurrentUser}
            isHighlighted={isHighlighted}
            onRetry={onRetry}
            onReply={onReply}
            onJumpToMessage={onJumpToMessage}
            onToggleReaction={onToggleReaction}
            onOpenReactionViewer={onOpenReactionViewer}
            showTimestamp={isLastInGroup}
          />
        </div>
      </div>

      {/* Read Receipts or Sent Status Indicator under message */}
      {readers.length > 0 ? (
        <ReadReceiptsList readers={readers} isCurrentUser={isCurrentUser} />
      ) : isCurrentUser && isLastInGroup && message.status === 'sent' ? (
        <div className="flex justify-end pr-1 mt-0.5 mb-1 select-none">
          <div
            className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 text-white dark:text-slate-200 flex items-center justify-center shadow-2xs"
            title="Đã gửi (chờ người nhận xem)"
          >
            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const MessageRow = React.memo(MessageRowComponent, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.created_at === nextProps.message.created_at &&
    prevProps.message.reply_to_message_id === nextProps.message.reply_to_message_id &&
    prevProps.message.reply_to?.content === nextProps.message.reply_to?.content &&
    prevProps.message.reactions === nextProps.message.reactions &&
    prevProps.readers === nextProps.readers &&
    prevProps.isCurrentUser === nextProps.isCurrentUser &&
    prevProps.isFirstInGroup === nextProps.isFirstInGroup &&
    prevProps.isLastInGroup === nextProps.isLastInGroup &&
    prevProps.isGroupConversation === nextProps.isGroupConversation &&
    prevProps.showDateSeparator === nextProps.showDateSeparator &&
    prevProps.isHighlighted === nextProps.isHighlighted
  );
});

MessageRow.displayName = 'MessageRow';
