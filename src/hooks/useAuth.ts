import { useCallback } from 'react';
import { authService } from '../services/auth';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Hook that wraps the auth Zustand store and auth service.
 * Provides session management, sign-in / OTP verification, and sign-out.
 */
export function useAuth() {
  const { session, user, isLoading, setSession, setUser, setLoading, reset } =
    useAuthStore();

  const isAuthenticated = !!session && !!user;

  /** Request an OTP to the given phone number. */
  const signIn = useCallback(
    async (phone: string) => {
      setLoading(true);
      try {
        await authService.signInWithOtp(phone);
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  /** Verify the OTP for a given phone number and persist the session. */
  const verifyOtp = useCallback(
    async (phone: string, token: string) => {
      setLoading(true);
      try {
        const { session: newSession, user: newUser } =
          await authService.verifyOtp(phone, token);
        setSession(newSession);
        setUser(newUser);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSession, setUser],
  );

  /** Sign the current user out and reset local state. */
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      reset();
    } finally {
      setLoading(false);
    }
  }, [setLoading, reset]);

  /** Refresh the user profile from the server. */
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const freshUser = await authService.getUser();
      setUser(freshUser);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

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
