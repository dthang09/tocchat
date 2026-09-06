import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SquarePen,
  Sun,
  Moon,
  MessageSquareDashed,
  X,
  Users,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../features/auth';
import {
  useConversations,
  ConversationRow,
  CreateGroupModal,
  type ConversationWithDetails,
} from '../../features/conversations';
import { useFriends } from '../../features/friends';
import { usePresence } from '../../features/presence';
import { Avatar } from '../../features/profiles';

export const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();
  const {
    conversations,
    isLoading: isLoadingConversations,
    createDirect,
  } = useConversations();

  const {
    friends,
    incomingCount,
  } = useFriends();

  const { isUserOnline } = usePresence();

  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'User';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenConversation = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
  };

  const handleContactClick = async (contactId: string) => {
    try {
      const conv = await createDirect(contactId);
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      console.error('Failed to open direct conversation:', err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    if (c.name && c.name.toLowerCase().includes(query)) return true;
    return c.members.some(
      (m) => m.profile?.display_name && m.profile.display_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col flex-1 pb-4">
      {/* Messenger Mobile Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2 flex items-center justify-between border-b border-transparent transition-colors">
        <div className="flex items-center gap-2.5">
          {/* User profile avatar thumbnail -> navigates to /profile */}
          <Avatar
            src={profile?.avatar_url}
            name={displayName}
            size="md"
            onClick={() => navigate('/profile')}
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
            Đoạn chat
          </h1>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Friends list shortcut button */}
          <button
            onClick={() => navigate('/friends')}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all relative"
            aria-label="Danh sách bạn bè"
            title="Bạn bè & Danh bạ"
          >
            <Users className="w-5 h-5" />
            {incomingCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Chuyển đổi giao diện sáng/tối"
            title="Đổi giao diện"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Create Group Button */}
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-brand-50 hover:bg-brand-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 active:scale-95 transition-all"
            aria-label="Tạo nhóm trò chuyện mới"
            title="Tạo nhóm mới"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Rounded Pill Search Bar */}
      <div className="px-4 pt-1 pb-2">
        <div className="relative flex items-center h-10 w-full rounded-full bg-slate-100 dark:bg-slate-900 px-3.5 text-slate-500 dark:text-slate-400 focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:bg-white dark:focus-within:bg-slate-950 focus-within:border-brand-500/50 border border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm đoạn chat..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active People / Quick Contacts Carousel */}
      <div className="pt-1 pb-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-1">
          {/* Create Group Action Slot */}
          <div
            onClick={() => setIsGroupModalOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="relative w-13 h-13 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-brand-300 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 w-14 text-center truncate">
              Tạo nhóm
            </span>
          </div>

          {/* Add Friend Action Slot */}
          <div
            onClick={() => navigate('/friends/search')}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="relative w-13 h-13 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 w-14 text-center truncate">
              Thêm bạn
            </span>
          </div>

          {/* Accepted Friends Carousel */}
          {friends.map((item) => {
            const friend = item.friend;
            const name = friend.display_name || 'Bạn bè';
            return (
              <div
                key={item.friendshipId}
                onClick={() => handleContactClick(friend.id)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
                title={`Nhắn tin với ${name}`}
              >
                <Avatar
                  src={friend.avatar_url}
                  name={name}
                  size="xl"
                  isOnline={isUserOnline(friend.id)}
                  showOnlineDot={true}
                />
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 w-14 text-center truncate">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversation List / Content Area */}
      <div className="flex-1 px-3 pt-2">
        {isLoadingConversations ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span className="text-xs">Đang tải danh sách đoạn chat...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          /* Empty State */
          <div className="min-h-[260px] flex flex-col items-center justify-center text-center px-4 py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3.5 shadow-2xs">
              <MessageSquareDashed className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc trò chuyện'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mb-5">
              {searchQuery
                ? 'Hãy thử tìm kiếm với tên nhóm hoặc thành viên khác.'
                : 'Bắt đầu cuộc trò chuyện đầu tiên của bạn với các thành viên trong nhóm bạn.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="h-11 px-5 rounded-full bg-brand-600 hover:bg-brand-500 active:scale-98 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
              >
                <SquarePen className="w-4 h-4" />
                <span>Tạo nhóm trò chuyện</span>
              </button>
            )}
          </div>
        ) : (
          /* List of Conversations */
          <div className="space-y-1">
            {filteredConversations.map((conv) => (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                onClick={() => handleOpenConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Group Conversation Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreated={(newConv: ConversationWithDetails) => {
          navigate(`/conversations/${newConv.id}`);
        }}
      />
    </div>
  );
};