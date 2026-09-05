import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { authService, formatAuthError } from '../services/authService';
import type { AuthState, SignInCredentials, SignUpCredentials, Profile } from '../types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthActions {
  initialize: () => Promise<void>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
  setUserAndSession: (user: User | null, session: Session | null, profile?: Profile | null) => void;
}

export type AuthStore = AuthState & AuthActions;

let isAuthListenerAttached = false;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  setUserAndSession: (user, session, profile = null) => {
    set({ user, session, profile });
  },

  initialize: async () => {
    // Only initialize once, but ensure listener is active
    if (!isAuthListenerAttached) {
      isAuthListenerAttached = true;

      supabase.auth.onAuthStateChange(async (_event, session) => {
        const currentUser = session?.user ?? null;
        let profile: Profile | null = null;

        if (currentUser) {
          try {
            profile = await authService.getProfile(currentUser.id);
          } catch (e) {
            console.warn('[useAuthStore] failed to fetch profile in onAuthStateChange:', e);
          }
        }

        set({
          user: currentUser,
          session: session ?? null,
          profile,
          isInitialized: true,
        });
      });
    }

    try {
      const session = await authService.getSession();
      const user = session?.user ?? null;
      let profile: Profile | null = null;

      if (user) {
        profile = await authService.getProfile(user.id);
      }

      set({
        user,
        session,
        profile,
        isInitialized: true,
      });
    } catch (err) {
      console.warn('[useAuthStore] initialize error:', err);
      set({ isInitialized: true });
    }
  },

  signIn: async (credentials: SignInCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, session } = await authService.signIn(credentials);
      const profile = await authService.getProfile(user.id);
      set({
        user,
        session,
        profile,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = formatAuthError(err);
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  signUp: async (credentials: SignUpCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, session } = await authService.signUp(credentials);
      let profile: Profile | null = null;
      if (user) {
        profile = await authService.getProfile(user.id);
      }
      set({
        user,
        session,
        profile,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = formatAuthError(err);
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = formatAuthError(err);
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const profile = await authService.getProfile(user.id);
      set({ profile });
    } catch (e) {
      console.warn('[useAuthStore] refreshProfile error:', e);
    }
  },
}));
