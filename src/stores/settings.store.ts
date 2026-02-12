import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n from '../i18n';

type Language = 'en' | 'kn';

interface SettingsState {
  language: Language;
  hasOnboarded: boolean;
}

interface SettingsActions {
  /** Change the app language and update i18next. */
  setLanguage: (language: Language) => void;
  setHasOnboarded: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      // ── State ──────────────────────────────────────────────────────────
      language: 'en',
      hasOnboarded: false,

      // ── Actions ────────────────────────────────────────────────────────
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
    }),
    {
      name: 'civickarma-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
