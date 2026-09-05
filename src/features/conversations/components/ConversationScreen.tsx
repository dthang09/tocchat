import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Phone,
  Video,
  Info,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { conversationService, type ConversationWithDetails } from '../services/conversationService';
import { useAuth } from '../../auth';
import { Avatar } from '../../../components/ui/Avatar';
import { Spinner } from '../../../components/ui/Spinner';

export const ConversationScreen: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    conversationService
      .getConversationById(conversationId, user?.id)
      .then((data) => {
        if (isMounted) {
          if (!data) {
            setError('Không tìm thấy cuộc trò chuyện này hoặc bạn chưa phải là thành viên.');
          } else {
            setConversation(data);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Lỗi tải cuộc trò chuyện.');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [conversationId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400">Đang tải đoạn chat...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Không thể mở cuộc trò chuyện
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5">
          {error || 'Cuộc trò chuyện không tồn tại hoặc đã bị xóa.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
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
            className="w-9 h-9 -ml-1 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all shrink-0"
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
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Cuộc gọi thoại (Sắp ra mắt ở Module 35)"
            aria-label="Gọi thoại"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Cuộc gọi video (Sắp ra mắt ở Module 36)"
            aria-label="Gọi video"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            className="w-9 h-9 rounded-full text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center active:scale-95 transition-all"
            title="Thông tin cuộc trò chuyện"
            aria-label="Thông tin"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Messages Body Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col justify-between">
        {/* Messenger Initial State Banner */}
        <div className="flex flex-col items-center text-center my-auto py-8 animate-in fade-in-50 duration-300">
          <div className="relative mb-3 p-1 rounded-full ring-2 ring-brand-500/20 shadow-md">
            <Avatar
              src={avatarUrl}
              name={name}
              size="3xl"
            />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            {name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed mb-4">
            {isGroup
              ? `Nhóm đã được tạo với ${conversation.memberCount} thành viên trong nhóm bạn của bạn.`
              : 'Hai bạn đã được kết nối trên TocChat.'}
          </p>

          <div className="px-4 py-2.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 rounded-2xl flex items-center gap-2 text-brand-700 dark:text-brand-300 text-xs font-medium max-w-xs shadow-xs">
            <Sparkles className="w-4 h-4 shrink-0 text-brand-500" />
            <span>Sẵn sàng trò chuyện! Cơ sở dữ liệu tin nhắn sẽ được kích hoạt ở Module 06.</span>
          </div>
        </div>

        {/* Members list pill chips in group */}
        {isGroup && conversation.members.length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-2">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Thành viên trong nhóm ({conversation.members.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {conversation.members.map((m) => (
                <div
                  key={m.user_id}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60 shadow-2xs"
                >
                  <Avatar
                    src={m.profile?.avatar_url}
                    name={m.profile?.display_name || 'User'}
                    size="xs"
                  />
                  <span>{m.profile?.display_name || 'Người dùng'}</span>
                  {m.role === 'admin' && (
                    <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer Area Placeholder (Prepared for Module 06) */}
      <footer className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shrink-0 pb-safe">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-2.5 text-slate-400 dark:text-slate-500 text-xs">
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="flex-1 select-none">Tính năng gửi tin nhắn đang được xây dựng (Module 06-07)...</span>
        </div>
      </footer>
    </div>
  );
};
