import { create } from 'zustand';

import {
  mockAuthService,
  type MockSession,
  type Profile,
} from '../services/mockData';

interface AuthState {
  session: MockSession | null;
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (session: MockSession | null) => void;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  /** Check for an existing session and hydrate state (mock: optional auto-login). */
  initialize: () => Promise<void>;
  /** Sign out and clear all auth state. */
  logout: () => Promise<void>;
  /** Re-fetch the user profile. */
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setSession: (session) => set({ session, isAuthenticated: session !== null }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      set({ isLoading: true });
      const session = await mockAuthService.getSession();
      if (session?.user) {
        const profile = await mockAuthService.getUser(session.user.id);
        set({
          session,
          user: profile ?? null,
          isAuthenticated: !!profile,
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
      await mockAuthService.signOut();
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
    const profile = await mockAuthService.getUser(session.user.id);
    set({ user: profile });
  },
}));
