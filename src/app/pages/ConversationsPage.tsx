import React, { useState } from 'react';
import { Search, SquarePen, Sun, Moon, MessageSquareDashed, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

interface QuickContact {
  id: string;
  name: string;
  initials: string;
  bgGradient: string;
}

export const ConversationsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample contacts layout for the active/quick-contacts carousel (Messenger pattern)
  const quickContacts: QuickContact[] = [
    { id: '1', name: 'Nam', initials: 'N', bgGradient: 'from-blue-500 to-cyan-400' },
    { id: '2', name: 'Minh', initials: 'M', bgGradient: 'from-purple-500 to-indigo-500' },
    { id: '3', name: 'Huy', initials: 'H', bgGradient: 'from-emerald-500 to-teal-400' },
    { id: '4', name: 'An', initials: 'A', bgGradient: 'from-rose-500 to-orange-400' },
    { id: '5', name: 'Linh', initials: 'L', bgGradient: 'from-amber-500 to-yellow-400' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col flex-1 pb-4">
      {/* Messenger Mobile Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2 flex items-center justify-between border-b border-transparent transition-colors">
        <div className="flex items-center gap-2.5">
          {/* User profile avatar thumbnail / status */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-sky-400 text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
            Đoạn chat
          </h1>
        </div>

        {/* Header Action Buttons (Circular, Messenger-style, >= 44x44px touch targets) */}
        <div className="flex items-center gap-1.5">
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

          <button
            className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Tạo cuộc trò chuyện mới"
            title="Tạo cuộc trò chuyện mới"
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
            placeholder="Tìm kiếm"
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

      {/* Active People / Quick Contacts (Horizontally scrollable carousel) */}
      <div className="pt-1 pb-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-1">
          {/* User's story / Note slot */}
          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform">
            <div className="relative w-13 h-13 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
              <span className="text-xl font-light text-brand-500 leading-none">+</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 w-14 text-center truncate">
              Ghi chú
            </span>
          </div>

          {/* Quick contacts */}
          {quickContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div
                  className={cn(
                    'w-13 h-13 rounded-full bg-gradient-to-tr text-white font-semibold text-base flex items-center justify-center shadow-xs',
                    contact.bgGradient
                  )}
                >
                  {contact.initials}
                </div>
                {/* Active indicator dot */}
                <span
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 ring-1 ring-emerald-400/20"
                  title="Đang hoạt động"
                />
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 w-14 text-center truncate">
                {contact.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation List / Content Area */}
      <div className="flex-1 px-4 pt-2">
        {/* Minimal Mobile Messaging Empty State */}
        <div className="min-h-[260px] flex flex-col items-center justify-center text-center px-4 py-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3.5">
            <MessageSquareDashed className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Chưa có cuộc trò chuyện
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mb-5">
            Bắt đầu cuộc trò chuyện đầu tiên của bạn với các thành viên trong nhóm.
          </p>
          <button
            className="h-11 px-5 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
          >
            <SquarePen className="w-4 h-4" />
            <span>Tạo cuộc trò chuyện</span>
          </button>
        </div>
      </div>
    </div>
  );
};