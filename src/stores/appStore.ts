import { create } from 'zustand';
import type { AppState, ThemeMode, ToastMessage } from '../types';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('tocchat_theme') as ThemeMode | null;
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved;
  }
  return 'system';
};

export const useAppStore = create<AppState>((set) => ({
  theme: getInitialTheme(),
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isLoading: false,
  loadingMessage: null,
  toasts: [],

  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tocchat_theme', theme);
      const root = document.documentElement;
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
    }
    set({ theme });
  },

  setOnline: (isOnline: boolean) => set({ isOnline }),

  setLoading: (isLoading: boolean, message: string | null = null) =>
    set({ isLoading, loadingMessage: message }),

  addToast: (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.durationMs ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));