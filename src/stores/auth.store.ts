import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { authService } from '../services/auth';
import type { Tables } from '../types/database';

type Profile = Tables<'profiles'>;

interface AuthState {
  session: Session | null;
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (session: Session | null) => void;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  /** Check for an existing session and hydrate state. */
  initialize: () => Promise<void>;
  /** Sign out and clear all auth state. */
  logout: () => Promise<void>;
  /** Re-fetch the user profile from the database. */
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // ── Actions ────────────────────────────────────────────────────────────────
  setSession: (session) =>
    set({ session, isAuthenticated: session !== null }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      const session = await authService.getSession();
      if (session?.user) {
        const profile = await authService.getUser(session.user.id);
        set({
          session,
          user: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.signOut();
    } finally {
      set({
        session: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  refreshUser: async () => {
    const { session } = get();
    if (!session?.user) return;

    const profile = await authService.getUser(session.user.id);
    set({ user: profile });
  },
}));
