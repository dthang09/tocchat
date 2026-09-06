import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Phone,
  Video,
  Info,
  Users,
  MessageSquare,
} from 'lucide-react';
import { conversationService, type ConversationWithDetails } from '../../conversations/services/conversationService';
import { useAuth } from '../../auth';
import { useChatMessages } from '../hooks/useChatMessages';
import { VirtualizedMessageList } from './VirtualizedMessageList';
import { MessageComposer } from './MessageComposer';
import { ReactionViewerModal } from './ReactionViewerModal';
import { Avatar } from '../../../components/ui/Avatar';
import { Spinner } from '../../../components/ui/Spinner';
import type { ChatSender } from '../types';

export const ChatScreen: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null);
  const [isConvLoading, setIsConvLoading] = useState(true);
  const [convError, setConvError] = useState<string | null>(null);

  // 1. Load conversation details
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    setIsConvLoading(true);
    setConvError(null);

    conversationService
      .getConversationById(conversationId, user?.id)
      .then((data) => {
        if (isMounted) {
          if (!data) {
            setConvError('Không tìm thấy cuộc trò chuyện này hoặc bạn chưa phải là thành viên.');
          } else {
            setConversation(data);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setConvError(err instanceof Error ? err.message : 'Lỗi tải cuộc trò chuyện.');
        }
      })
      .finally(() => {
        if (isMounted) setIsConvLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [conversationId, user?.id]);

  // 2. Build map of member profiles for instant sender resolution
  const membersMap = useMemo(() => {
    const map: Record<string, ChatSender> = {};
    if (conversation?.members) {
      for (const m of conversation.members) {
        if (m.profile) {
          map[m.user_id] = {
            id: m.user_id,
            display_name: m.profile.display_name,
            avatar_url: m.profile.avatar_url,
          };
        }
      }
    }
    return map;
  }, [conversation?.members]);

  // 3. Connect messages hook with replies, reactions, and jump-to support
  const {
    messages,
    isLoading: isMessagesLoading,
    isLoadingOlder,
    hasMore,
    error: messagesError,
    replyingTo,
    highlightedMessageId,
    reactionViewerMessage,
    readersByMessageId,
    sendMessage,
    retryMessage,
    loadOlderMessages,
    startReply,
    cancelReply,
    toggleReaction,
    jumpToMessage,
    openReactionViewer,
    closeReactionViewer,
  } = useChatMessages({
    conversationId: conversationId || '',
    currentUserId: user?.id,
    currentUserProfile: profile,
    membersMap,
  });

  if (isConvLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-950">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400">Đang mở cuộc trò chuyện...</p>
      </div>
    );
  }

  if (convError || !conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-950">
        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Không thể mở cuộc trò chuyện
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5">
          {convError || 'Cuộc trò chuyện không tồn tại hoặc đã bị xóa.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isGroup = conversation.type === 'group';
  const name = conversation.name || (isGroup ? 'Nhóm chưa đặt tên' : 'Người dùng TocChat');
  const avatarUrl = conversation.avatar_url;
  const subtitle = isGroup
    ? `${conversation.memberCount} thành viên`
    : 'Đang hoạt động';

  return (
    <div className="flex flex-col flex-1 h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Messenger Mobile Chat Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-3 pt-2.5 pb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shadow-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 -ml-1 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Quay lại danh sách"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative shrink-0">
            <Avatar
              src={avatarUrl}
              name={name}
              size="md"
              isOnline={!isGroup}
              showOnlineDot={!isGroup}
            />
            {isGroup && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-900 ring-1.5 ring-white dark:ring-slate-950 flex items-center justify-center text-slate-500">
                <Users className="w-2.5 h-2.5" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
              {name}
            </h2>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate leading-tight">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Action Buttons (Voice call, Video call, Info) */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Cuộc gọi thoại (Sắp ra mắt)"
            aria-label="Gọi thoại"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Cuộc gọi video (Sắp ra mắt)"
            aria-label="Gọi video"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Thông tin cuộc trò chuyện"
            aria-label="Thông tin"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Messages Body Area */}
      {isMessagesLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <Spinner size="md" />
          <p className="text-xs text-slate-400">Đang tải tin nhắn...</p>
        </div>
      ) : messagesError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs text-rose-500 mb-2">{messagesError}</p>
        </div>
      ) : (
        <VirtualizedMessageList
          messages={messages}
          currentUserId={user?.id}
          isGroupConversation={isGroup}
          conversationName={name}
          conversationAvatar={avatarUrl}
          isLoadingOlder={isLoadingOlder}
          hasMore={hasMore}
          highlightedMessageId={highlightedMessageId}
          readersByMessageId={readersByMessageId}
          onLoadOlder={loadOlderMessages}
          onRetryMessage={retryMessage}
          onReplyMessage={startReply}
          onJumpToMessage={jumpToMessage}
          onToggleReaction={toggleReaction}
          onOpenReactionViewer={openReactionViewer}
        />
      )}

      {/* Message Composer Footer with Reply Preview & Cancel */}
      <MessageComposer
        onSendMessage={sendMessage}
        replyingTo={replyingTo}
        onCancelReply={cancelReply}
        disabled={!user}
        placeholder="Nhập tin nhắn..."
      />

      {/* Reaction Viewer Modal */}
      {reactionViewerMessage && (
        <ReactionViewerModal
          message={reactionViewerMessage}
          currentUserId={user?.id}
          onRemoveReaction={(emoji) => {
            if (reactionViewerMessage) {
              toggleReaction(reactionViewerMessage.id, emoji);
            }
          }}
          onClose={closeReactionViewer}
        />
      )}
    </div>
  );
};
