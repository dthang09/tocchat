import React, { useState } from 'react';
import { Bot, Plus, Search, Sparkles } from 'lucide-react';

export const BotsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col flex-1 pb-4">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2 flex items-center justify-between border-b border-transparent">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          AI Bots
        </h1>
        <button
          className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Tạo bot mới"
          title="Tạo bot mới"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Rounded Search Pill */}
      <div className="px-4 pt-1 pb-3">
        <div className="relative flex items-center h-10 w-full rounded-full bg-slate-100 dark:bg-slate-900 px-3.5 text-slate-500 dark:text-slate-400 focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:bg-white dark:focus-within:bg-slate-950 border border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trợ lý AI..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clean Messaging Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3.5">
          <Bot className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Chưa có trợ lý AI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mb-5">
          Tạo hoặc kết nối bot AI để hỗ trợ tự động trong các cuộc trò chuyện nhóm.
        </p>
        <button
          className="h-11 px-5 rounded-full bg-purple-600 hover:bg-purple-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Thêm trợ lý AI</span>
        </button>
      </div>
    </div>
  );
};