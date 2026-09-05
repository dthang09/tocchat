import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  UserPlus,
  MessageCircle,
  UserMinus,
  Check,
  X,
  Clock,
  Users,
  Inbox,
  Send,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useFriends } from '../hooks/useFriends';
import { conversationService } from '../../conversations/services/conversationService';
import { Avatar } from '../../../components/ui/Avatar';

type FriendTab = 'friends' | 'incoming' | 'sent';

export const FriendListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    friends,
    requests,
    incomingCount,
    sentCount,
    isLoading,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeFriend,
    isActionLoading,
  } = useFriends();

  const [activeTab, setActiveTab] = useState<FriendTab>('friends');

  const handleOpenChat = async (friendId: string) => {
    if (!user) return;
    try {
      const conv = await conversationService.createDirectConversation(user.id, friendId);
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      console.error('Failed to open direct conversation:', err);
    }
  };

  const handleRemoveFriend = async (friendshipId: string, friendName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy kết bạn với ${friendName}?`)) {
      await removeFriend(friendshipId, friendName);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Mobile Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Bạn bè & Danh bạ
          </h1>
        </div>

        <button
          onClick={() => navigate('/friends/search')}
          className="h-9 px-3 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          title="Tìm kiếm bạn mới"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm bạn</span>
        </button>
      </header>

      {/* Tabs Switcher */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'friends'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bạn bè ({friends.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === 'incoming'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Lời mời</span>
            {incomingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                {incomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'sent'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đã gửi ({sentCount})</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 px-4 pt-2">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span className="text-xs">Đang tải danh sách...</span>
          </div>
        ) : activeTab === 'friends' ? (
          /* Friends List Tab */
          friends.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Bạn chưa có bạn bè nào
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4 leading-relaxed">
                Tìm kiếm và kết bạn với các thành viên trong nhóm để trò chuyện và thêm vào nhóm chat.
              </p>
              <button
                onClick={() => navigate('/friends/search')}
                className="h-10 px-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tìm bạn bè ngay</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((item) => {
                const friend = item.friend;
                const name = friend.display_name || 'Người dùng TocChat';
                const username = friend.username ? `@${friend.username}` : '';
                const isActionBusy = isActionLoading(item.friendshipId);

                return (
                  <div
                    key={item.friendshipId}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <div
                      onClick={() => handleOpenChat(friend.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <Avatar
                        src={friend.avatar_url}
                        name={name}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {name}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {username || friend.status || 'Thành viên TocChat'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => handleOpenChat(friend.id)}
                        className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/60 flex items-center justify-center active:scale-95 transition-all"
                        title="Nhắn tin"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRemoveFriend(item.friendshipId, name)}
                        disabled={isActionBusy}
                        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center active:scale-95 transition-all"
                        title="Hủy kết bạn"
                      >
                        {isActionBusy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserMinus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === 'incoming' ? (
          /* Incoming Requests Tab */
          requests.incoming.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Không có lời mời kết bạn nào đang chờ.
            </div>
          ) : (
            <div className="space-y-2">
              {requests.incoming.map(({ friendship, sender }) => {
                const name = sender.display_name || 'Người dùng TocChat';
                const username = sender.username ? `@${sender.username}` : '';
                const isActionBusy = isActionLoading(friendship.id);

                return (
                  <div
                    key={friendship.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={sender.avatar_url}
                        name={name}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {name}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {username || 'Muốn kết bạn với bạn'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => acceptRequest(friendship.id)}
                        disabled={isActionBusy}
                        className="px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                      >
                        {isActionBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Đồng ý</span>
                      </button>

                      <button
                        onClick={() => declineRequest(friendship.id)}
                        disabled={isActionBusy}
                        className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 text-xs font-medium active:scale-95 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Sent Requests Tab */
          requests.sent.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Bạn chưa gửi lời mời kết bạn nào.
            </div>
          ) : (
            <div className="space-y-2">
              {requests.sent.map(({ friendship, recipient }) => {
                const name = recipient.display_name || 'Người dùng TocChat';
                const username = recipient.username ? `@${recipient.username}` : '';
                const isActionBusy = isActionLoading(friendship.id);

                return (
                  <div
                    key={friendship.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={recipient.avatar_url}
                        name={name}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {name}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{username ? `${username} • ` : ''}Đang chờ chấp nhận</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelRequest(friendship.id)}
                      disabled={isActionBusy}
                      className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-medium active:scale-95 transition-all shrink-0 ml-2"
                    >
                      {isActionBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Hủy lời mời</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
