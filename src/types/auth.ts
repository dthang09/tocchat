import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from './database';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
