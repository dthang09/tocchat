import React from 'react';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../utils/cn';

export interface MessageRowProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isGroupConversation: boolean;
  showDateSeparator: boolean;
  onRetry?: (messageId: string) => void;
}

const MessageRowComponent: React.FC<MessageRowProps> = ({
  message,
  isCurrentUser,
  isFirstInGroup,
  isLastInGroup,
  isGroupConversation,
  showDateSeparator,
  onRetry,
}) => {
  const senderName = message.sender?.display_name || 'Người dùng';
  const senderAvatar = message.sender?.avatar_url;

  return (
    <div className="flex flex-col w-full">
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
            onRetry={onRetry}
            showTimestamp={isLastInGroup}
          />
        </div>
      </div>
    </div>
  );
};

export const MessageRow = React.memo(MessageRowComponent, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.created_at === nextProps.message.created_at &&
    prevProps.isCurrentUser === nextProps.isCurrentUser &&
    prevProps.isFirstInGroup === nextProps.isFirstInGroup &&
    prevProps.isLastInGroup === nextProps.isLastInGroup &&
    prevProps.isGroupConversation === nextProps.isGroupConversation &&
    prevProps.showDateSeparator === nextProps.showDateSeparator
  );
});

MessageRow.displayName = 'MessageRow';
