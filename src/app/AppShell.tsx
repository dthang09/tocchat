import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Bot, Phone, Settings, WifiOff } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ToastContainer } from '../components/ui/Toast';
import { Spinner } from '../components/ui/Spinner';
import { cn } from '../utils/cn';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const { isLoading, loadingMessage } = useAppStore();

  const isConversationOpen = location.pathname.startsWith('/conversations/');

  const navItems = [
    { to: '/', label: 'Đoạn chat', icon: MessageCircle },
    { to: '/bots', label: 'AI Bots', icon: Bot },
    { to: '/calls', label: 'Cuộc gọi', icon: Phone },
    { to: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    /* Desktop backdrop wrapper - keeps mobile experience centered without stretching across 1500px */
    <div className="min-h-[100dvh] w-full bg-slate-900 md:bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Mobile Application Container */}
      <div className="w-full max-w-[440px] h-[100dvh] md:h-[min(880px,96dvh)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden relative md:rounded-[40px] md:shadow-2xl md:ring-1 md:ring-slate-800/80 antialiased select-none">
        {/* Offline notification banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shrink-0 z-40">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Đang ngoại tuyến</span>
          </div>
        )}

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto relative overscroll-none no-scrollbar flex flex-col">
          <Outlet />
        </main>

        {/* Mobile Native-Style Bottom Navigation (Hidden when in full conversation chat) */}
        {!isConversationOpen && (
          <nav
            className="h-[64px] border-t border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3 flex items-center justify-around z-30 shrink-0 pb-safe"
            aria-label="Điều hướng chính"
          >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 rounded-2xl transition-all duration-150',
                  isActive
                    ? 'text-brand-500 dark:text-brand-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'w-10 h-7 flex items-center justify-center rounded-full transition-colors',
                      isActive && 'bg-brand-50 dark:bg-brand-950/60'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-150',
                        isActive && 'scale-105'
                      )}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />
                  </div>
                  <span className="text-[10px] leading-tight tracking-tight mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        )}

        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
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
    </div>
  );
};