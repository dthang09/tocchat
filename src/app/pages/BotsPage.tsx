import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const BotsPage: React.FC = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">AI Bots Platform</h2>
          <p className="text-xs text-slate-500">Quản lý và thiết lập trợ lý AI (OpenAI, Google Gemini)</p>
        </div>
      </div>
      <div className="text-center py-12 text-slate-400 text-xs">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
        Sẽ được triển khai trong Phase 4 (Modules 24-33).
      </div>
    </div>
  );
};