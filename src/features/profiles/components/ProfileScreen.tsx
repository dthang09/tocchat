import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit3, Mail, Calendar, User, Smile } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useProfile();

  const displayName =
    profile?.display_name ||
    (user?.user_metadata?.display_name as string) ||
    user?.email?.split('@')[0] ||
    'Thành viên TocChat';

  const status = profile?.status || 'Đang hoạt động';
  const avatarUrl = profile?.avatar_url || null;
  const userEmail = user?.email || 'Chưa cập nhật email';

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Gần đây';

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Trang cá nhân
        </h1>
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-brand-600 dark:text-brand-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Chỉnh sửa"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </header>

      <div className="px-4 space-y-6 pt-4">
        {/* Profile Hero Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 p-1 rounded-full ring-2 ring-brand-500/20 shadow-md">
            <Avatar
              src={avatarUrl}
              name={displayName}
              size="3xl"
              isOnline={true}
              showOnlineDot={true}
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {displayName}
          </h2>

          <div className="mt-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Smile className="w-3.5 h-3.5 text-brand-500" />
            <span>{status}</span>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {userEmail}
          </p>

          <div className="w-full max-w-xs mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/profile/edit')}
              className="w-full h-10 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin cá nhân</span>
            </Button>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
            Thông tin chi tiết
          </h3>

          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
            {/* Display Name */}
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">
                  Tên hiển thị
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {displayName}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
                <Smile className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">
                  Trạng thái
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
                  {status}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">
                  Email đăng nhập
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
                  {userEmail}
                </span>
              </div>
            </div>

            {/* Joined Date */}
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">
                  Ngày tham gia
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
                  {joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
