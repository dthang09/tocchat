import React, { useState } from 'react';
import { Phone, PhoneCall, Video } from 'lucide-react';
import { cn } from '../../utils/cn';

export const CallsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'missed'>('all');

  return (
    <div className="flex flex-col flex-1 pb-4">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-2 flex items-center justify-between border-b border-transparent">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Cuộc gọi
        </h1>
        <button
          className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Bắt đầu cuộc gọi mới"
          title="Cuộc gọi mới"
        >
          <PhoneCall className="w-5 h-5" />
        </button>
      </header>

      {/* Segmented Filter Pills (Messenger / iOS Style) */}
      <div className="px-4 pt-1 pb-3">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
              filter === 'missed'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            )}
          >
            Cuộc gọi nhỡ
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5">
          <Phone className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Chưa có cuộc gọi gần đây
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mb-5">
          Bạn có thể thực hiện cuộc gọi thoại hoặc video chất lượng cao với bạn bè.
        </p>
        <button
          className="h-11 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>Bắt đầu cuộc gọi</span>
        </button>
      </div>
    </div>
  );
};