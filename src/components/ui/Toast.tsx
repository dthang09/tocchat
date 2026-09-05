import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-3 left-0 right-0 z-50 flex flex-col gap-2 max-w-full pointer-events-none px-3 pt-safe">
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
          success: <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
        };

        const bgStyles = {
          info: 'bg-white/95 dark:bg-slate-900/95 border-sky-200 dark:border-sky-900/50 text-slate-800 dark:text-slate-100',
          success: 'bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-900/50 text-slate-800 dark:text-slate-100',
          warning: 'bg-white/95 dark:bg-slate-900/95 border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-100',
          error: 'bg-white/95 dark:bg-slate-900/95 border-rose-200 dark:border-rose-900/50 text-slate-800 dark:text-slate-100',
        };

        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg border backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200 text-xs font-medium',
              bgStyles[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="flex-1 leading-snug truncate">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};