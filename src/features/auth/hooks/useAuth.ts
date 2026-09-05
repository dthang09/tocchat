import { useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    error,
    initialize,
    signIn,
    signUp,
    signOut,
    clearError,
    refreshProfile,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: Boolean(user),
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    refreshProfile,
  };
}
