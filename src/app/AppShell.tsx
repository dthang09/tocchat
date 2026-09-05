import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { MessageSquare, Bot, PhoneCall, Settings, Sun, Moon, WifiOff } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useTheme } from '../hooks/useTheme';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ToastContainer } from '../components/ui/Toast';
import { Spinner } from '../components/ui/Spinner';
import { cn } from '../utils/cn';

export const AppShell: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const { isLoading, loadingMessage } = useAppStore();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const navItems = [
    { to: '/', label: 'Đoạn chat', icon: MessageSquare },
    { to: '/bots', label: 'AI Bots', icon: Bot },
    { to: '/calls', label: 'Cuộc gọi', icon: PhoneCall },
    { to: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased select-none">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mất kết nối mạng. Đang chạy ở chế độ ngoại tuyến.</span>
        </div>
      )}

      {/* Global Top Header */}
      <header className="h-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-bold text-base shadow-sm">
            T
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none text-slate-900 dark:text-white">
              TocChat
            </h1>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Private Messenger
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Đổi giao diện"
            aria-label="Đổi giao diện"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative overscroll-none">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile Shell */}
      <nav className="h-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 flex items-center justify-around z-30 shrink-0 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-colors text-xs font-medium',
                isActive
                  ? 'text-brand-500 dark:text-brand-400'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-slate-200 dark:border-slate-800">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {loadingMessage || 'Đang xử lý...'}
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};