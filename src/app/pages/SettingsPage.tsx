import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Bell,
  Shield,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../features/auth';
import { Avatar } from '../../features/profiles';
import { cn } from '../../utils/cn';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut, isLoading } = useAuth();

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Thành viên TocChat';

  const userEmail = user?.email || 'Chưa cập nhật email';
  const status = profile?.status || 'Đang hoạt động';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2 flex items-center justify-between border-b border-transparent">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Cài đặt
        </h1>
      </header>

      <div className="px-4 space-y-4 pt-2">
        {/* User Profile Card (Messenger mobile pattern) */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 cursor-pointer active:scale-98 transition-all hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
        >
          <Avatar
            src={profile?.avatar_url}
            name={displayName}
            size="xl"
            showOnlineDot={true}
            isOnline={true}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {displayName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {status} • {userEmail}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Section: Tùy chỉnh hiển thị */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
            Giao diện
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-1.5 flex gap-1">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all',
                theme === 'light'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              )}
            >
              <Sun className="w-4 h-4" />
              <span>Sáng</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all',
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              )}
            >
              <Moon className="w-4 h-4" />
              <span>Tối</span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all',
                theme === 'system'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              )}
            >
              <Smartphone className="w-4 h-4" />
              <span>Hệ thống</span>
            </button>
          </div>
        </div>

        {/* Section: Quyền riêng tư & Thông báo */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
            Tùy chọn
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
            <div className="flex items-center justify-between p-3.5 min-h-[52px] cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Chủ đề đoạn chat</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3.5 min-h-[52px] cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Thông báo & Âm thanh</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3.5 min-h-[52px] cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Quyền riêng tư & An toàn</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Section: Ứng dụng & Tài khoản */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
            Tài khoản
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
            <div className="flex items-center justify-between p-3.5 min-h-[52px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Phiên bản</span>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">1.0.0</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3.5 min-h-[52px] cursor-pointer hover:bg-rose-50/60 dark:hover:bg-rose-950/20 active:bg-rose-100/50 dark:active:bg-rose-950/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};