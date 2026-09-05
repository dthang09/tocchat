import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
          success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
        };

        const bgStyles = {
          info: 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-900/50',
          success: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50',
          warning: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50',
          error: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50',
        };

        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200',
              bgStyles[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-md transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};