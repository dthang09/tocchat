import React from 'react';
import { PhoneCall, Video } from 'lucide-react';

export const CallsPage: React.FC = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">Cuộc gọi thoại & Video</h2>
          <p className="text-xs text-slate-500">Gọi nhóm thời gian thực qua kiến trúc SFU</p>
        </div>
      </div>
      <div className="text-center py-12 text-slate-400 text-xs">
        <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
        Sẽ được triển khai trong Phase 5 (Modules 34-37).
      </div>
    </div>
  );
};