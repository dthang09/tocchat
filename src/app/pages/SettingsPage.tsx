import React from 'react';
import { Shield, Palette, Info } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-brand-500" />
            <span className="text-sm font-medium">Giao diện</span>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-brand-500 outline-none"
          >
            <option value="system">Hệ thống</option>
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">Bảo mật</span>
          </div>
          <span className="text-xs text-slate-400">RLS Enforced</span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-sky-500" />
            <span className="text-sm font-medium">Phiên bản</span>
          </div>
          <span className="text-xs font-mono text-slate-400">v0.1.0-alpha (Module 01)</span>
        </div>
      </div>
    </div>
  );
};