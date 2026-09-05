import React from 'react';
import { MessageSquarePlus, Search } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

export const ConversationsPage: React.FC = () => {
  const { addToast } = useAppStore();

  const handleTestToast = () => {
    addToast({
      type: 'info',
      message: 'Hệ thống nền tảng Module 01 đang hoạt động tốt!',
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-brand-500 rounded-xl text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Welcome Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500/10 via-sky-500/5 to-transparent border border-brand-500/20 text-slate-800 dark:text-slate-200">
        <h2 className="font-semibold text-lg text-brand-600 dark:text-brand-400 mb-1">
          Chào mừng đến với TocChat
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          Nền tảng nhắn tin bảo mật, hỗ trợ AI Gateway, cuộc gọi nhóm SFU và tùy biến giao diện dành cho nhóm riêng tư.
        </p>
        <button
          onClick={handleTestToast}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          Thử thông báo (Toast test)
        </button>
      </div>

      {/* Empty State / Status */}
      <div className="py-12 text-center text-slate-400 dark:text-slate-600">
        <p className="text-sm font-medium">Chưa có cuộc trò chuyện nào</p>
        <p className="text-xs mt-1">Các module tiếp theo sẽ mở rộng tính năng nhắn tin thời gian thực.</p>
      </div>
    </div>
  );
};