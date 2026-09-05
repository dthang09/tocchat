import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  X,
  UserPlus,
  Check,
  Clock,
  MessageCircle,
  Loader2,
  Users,
} from 'lucide-react';
import { useAuth } from '../../auth';
import {
  friendService,
  type UserSearchResult,
} from '../services/friendService';
import { useFriends } from '../hooks/useFriends';
import { conversationService } from '../../conversations/services/conversationService';
import { Avatar } from '../../../components/ui/Avatar';

export const FriendSearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendRequest, acceptRequest, declineRequest, cancelRequest } = useFriends();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Debounced user search
  useEffect(() => {
    if (!user) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const found = await friendService.searchUsers(trimmed, user.id);
        setResults(found);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, user]);

  const handleSendRequest = async (targetUserId: string) => {
    setLoadingActionId(targetUserId);
    try {
      await sendRequest(targetUserId);
      setResults((prev) =>
        prev.map((r) =>
          r.profile.id === targetUserId
            ? { ...r, relationship: 'pending_sent' }
            : r
        )
      );
    } catch {
      // Toast shown by hook
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleAccept = async (item: UserSearchResult) => {
    if (!item.friendshipId) return;
    setLoadingActionId(item.profile.id);
    try {
      await acceptRequest(item.friendshipId);
      setResults((prev) =>
        prev.map((r) =>
          r.profile.id === item.profile.id
            ? { ...r, relationship: 'accepted' }
            : r
        )
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleDecline = async (item: UserSearchResult) => {
    if (!item.friendshipId) return;
    setLoadingActionId(item.profile.id);
    try {
      await declineRequest(item.friendshipId);
      setResults((prev) =>
        prev.map((r) =>
          r.profile.id === item.profile.id
            ? { ...r, relationship: 'none', friendshipId: undefined }
            : r
        )
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleCancel = async (item: UserSearchResult) => {
    if (!item.friendshipId) return;
    setLoadingActionId(item.profile.id);
    try {
      await cancelRequest(item.friendshipId);
      setResults((prev) =>
        prev.map((r) =>
          r.profile.id === item.profile.id
            ? { ...r, relationship: 'none', friendshipId: undefined }
            : r
        )
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleOpenChat = async (friendId: string) => {
    if (!user) return;
    try {
      const conv = await conversationService.createDirectConversation(user.id, friendId);
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      console.error('Error opening chat:', err);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-3 pt-3 pb-2.5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="relative flex-1 flex items-center h-10 rounded-full bg-slate-100 dark:bg-slate-900 px-3 text-slate-400">
          <Search className="w-4 h-4 mr-2 shrink-0 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc @username..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full shrink-0"
              aria-label="Xóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Results content */}
      <div className="flex-1 px-4 pt-3">
        {isSearching ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span className="text-xs">Đang tìm kiếm...</span>
          </div>
        ) : !query.trim() ? (
          /* Empty search prompt */
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Tìm kiếm bạn bè
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
              Nhập tên hiển thị hoặc username của người bạn muốn kết nối trong nhóm TocChat.
            </p>
          </div>
        ) : results.length === 0 ? (
          /* No results */
          <div className="py-16 text-center text-xs text-slate-400">
            Không tìm thấy người dùng nào phù hợp với &quot;{query}&quot;.
          </div>
        ) : (
          /* User list */
          <div className="space-y-1.5">
            {results.map((item) => {
              const { profile, relationship } = item;
              const isLoading = loadingActionId === profile.id;
              const displayName = profile.display_name || 'Người dùng TocChat';
              const username = profile.username ? `@${profile.username}` : '';

              return (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={profile.avatar_url}
                      name={displayName}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {username || profile.status || 'Thành viên TocChat'}
                      </p>
                    </div>
                  </div>

                  {/* Relationship Action Button */}
                  <div className="shrink-0 ml-2">
                    {relationship === 'self' ? (
                      <span className="px-3 py-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold select-none">
                        Tài khoản của bạn
                      </span>
                    ) : relationship === 'accepted' ? (
                      <button
                        onClick={() => handleOpenChat(profile.id)}
                        className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Mở đoạn chat"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-brand-500" />
                        <span>Bạn bè</span>
                      </button>
                    ) : relationship === 'pending_sent' ? (
                      <button
                        onClick={() => handleCancel(item)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-all"
                        title="Bấm để hủy lời mời"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>Đã gửi</span>
                      </button>
                    ) : relationship === 'pending_received' ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAccept(item)}
                          disabled={isLoading}
                          className="px-2.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Đồng ý</span>
                        </button>
                        <button
                          onClick={() => handleDecline(item)}
                          disabled={isLoading}
                          className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                          title="Từ chối"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(profile.id)}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="w-3.5 h-3.5" />
                        )}
                        <span>Thêm bạn</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
