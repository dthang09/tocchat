/**
 * Shared Type Definitions for TocChat
 */

export * from './database';
export * from './auth';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  durationMs?: number;
}

export interface AppState {
  theme: ThemeMode;
  isOnline: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
  toasts: ToastMessage[];
  setTheme: (theme: ThemeMode) => void;
  setOnline: (isOnline: boolean) => void;
  setLoading: (isLoading: boolean, message?: string | null) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
}