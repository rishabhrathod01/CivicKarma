import { useCallback } from 'react';

import { mockAuthService } from '../services/mockData';
import { useAuthStore } from '../stores/auth.store';

/**
 * Hook that wraps the auth Zustand store and mock auth service.
 * Provides session management, sign-in / OTP verification, and sign-out.
 */
export function useAuth() {
  const {
    session,
    user,
    isLoading,
    setSession,
    setUser,
    setLoading,
    logout: storeLogout,
    refreshUser: storeRefreshUser,
  } = useAuthStore();

  const isAuthenticated = !!session && !!user;

  /** Request an OTP (mock: immediately succeeds and returns). */
  const signIn = useCallback(
    async (phone: string) => {
      setLoading(true);
      try {
        const { session: newSession, user: newUser } =
          await mockAuthService.signInWithOtp(phone);
        setSession(newSession);
        const profile = await mockAuthService.getUser(newUser.id);
        setUser(profile);
      } finally {
        setLoading(false);
      }
    },
    [setSession, setUser, setLoading],
  );

  /** Verify the OTP (mock: accepts any 6 digits and sets user). */
  const verifyOtp = useCallback(
    async (phone: string, token: string) => {
      setLoading(true);
      try {
        const { session: newSession, user: newUser } =
          await mockAuthService.verifyOtp(phone, token);
        setSession(newSession);
        const profile = await mockAuthService.getUser(newUser.id);
        setUser(profile);
      } finally {
        setLoading(false);
      }
    },
    [setSession, setUser, setLoading],
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await mockAuthService.signOut();
      await storeLogout();
    } finally {
      setLoading(false);
    }
  }, [setLoading, storeLogout]);

  const refreshUser = useCallback(async () => {
    const userId = useAuthStore.getState().user?.id ?? session?.user?.id;
    if (!userId) return;
    setLoading(true);
    try {
      const freshUser = await mockAuthService.getUser(userId);
      setUser(freshUser);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, setUser, setLoading]);

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    signIn,
    verifyOtp,
    signOut,
    refreshUser,
  } as const;
}
