import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile, SignInCredentials, SignUpCredentials } from '../types';

export class AuthError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Format any Supabase Auth or Network error into a user-friendly Vietnamese message
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'Đã có lỗi xảy ra. Vui lòng thử lại.';

  if (typeof error === 'string') {
    return error;
  }

  const err = error as { message?: string; status?: number; code?: string };
  const rawMessage = (err.message || '').toLowerCase();

  if (rawMessage.includes('invalid login credentials') || rawMessage.includes('invalid_grant')) {
    return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
  }

  if (rawMessage.includes('user already registered') || rawMessage.includes('email already in use')) {
    return 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập hoặc dùng email khác.';
  }

  if (rawMessage.includes('password should be at least 6 characters') || rawMessage.includes('weak password')) {
    return 'Mật khẩu phải có độ dài ít nhất 6 ký tự.';
  }

  if (rawMessage.includes('email not confirmed')) {
    return 'Tài khoản chưa được xác thực qua email. Vui lòng kiểm tra hộp thư của bạn.';
  }

  if (rawMessage.includes('rate limit') || rawMessage.includes('too many requests')) {
    return 'Bạn đã thao tác quá nhiều lần. Vui lòng đợi trong giây lát rồi thử lại.';
  }

  if (
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('network') ||
    rawMessage.includes('networkrequestfailed')
  ) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url || url.includes('placeholder.supabase.co')) {
      return 'Chưa cấu hình Supabase Backend. Bạn cần thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env.';
    }
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
  }

  if (rawMessage.includes('user not found')) {
    return 'Không tìm thấy tài khoản với email này.';
  }

  return err.message || 'Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.';
}

export const authService = {
  /**
   * Register with email, password, and display name
   */
  async signUp({ email, password, displayName }: SignUpCredentials): Promise<{ user: User; session: Session | null }> {
    const trimmedEmail = email.trim();
    const trimmedDisplayName = displayName.trim();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          display_name: trimmedDisplayName,
        },
      },
    });

    if (error) {
      throw new AuthError(formatAuthError(error), error);
    }

    if (!data.user) {
      throw new AuthError('Không thể tạo tài khoản người dùng. Vui lòng thử lại.');
    }

    // Ensure profile row exists immediately after signup
    try {
      await authService.ensureProfile(data.user.id, trimmedDisplayName, trimmedEmail);
    } catch (profileError) {
      // Don't fail the whole registration if profile insert encounters temporary RLS check before session confirms
      console.warn('[authService] ensureProfile warning after signup:', profileError);
    }

    return { user: data.user, session: data.session };
  },

  /**
   * Log in with email and password
   */
  async signIn({ email, password }: SignInCredentials): Promise<{ user: User; session: Session }> {
    const trimmedEmail = email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      throw new AuthError(formatAuthError(error), error);
    }

    if (!data.user || !data.session) {
      throw new AuthError('Đăng nhập thất bại. Không nhận được thông tin phiên.');
    }

    // Ensure profile exists on successful login
    try {
      await authService.ensureProfile(
        data.user.id,
        (data.user.user_metadata?.display_name as string) || null,
        trimmedEmail
      );
    } catch (profileError) {
      console.warn('[authService] ensureProfile warning after login:', profileError);
    }

    return { user: data.user, session: data.session };
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError(formatAuthError(error), error);
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[authService] getSession error:', error.message);
      return null;
    }
    return data.session;
  },

  /**
   * Get current authenticated user
   */
  async getUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  },

  /**
   * Fetch profile by user ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[authService] getProfile error:', error.message);
      return null;
    }

    return data as Profile | null;
  },

  /**
   * Ensure a profile row exists for the user.
   * If it doesn't exist, create it with display_name fallback.
   */
  async ensureProfile(
    userId: string,
    fallbackDisplayName?: string | null,
    email?: string | null
  ): Promise<Profile | null> {
    // 1. Check if profile already exists
    const existing = await authService.getProfile(userId);
    if (existing) {
      return existing;
    }

    // 2. Fallback name calculation
    const derivedName =
      fallbackDisplayName?.trim() ||
      (email ? email.split('@')[0] : 'Thành viên TocChat');

    // 3. Insert profile row
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: derivedName,
        status: 'Đang hoạt động',
      })
      .select('*')
      .single();

    if (error) {
      // If error is duplicate key, re-fetch
      if (error.code === '23505') {
        return authService.getProfile(userId);
      }
      console.warn('[authService] Insert profile error:', error.message);
      return null;
    }

    return data as Profile;
  },
};
