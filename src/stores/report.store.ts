import { create } from 'zustand';

import type { ReportDraft } from '../types/complaints';

const DEFAULT_DRAFT: ReportDraft = {
  categoryId: '',
  subcategoryId: null,
  description: '',
  photos: [],
  latitude: 0,
  longitude: 0,
  address: null,
};

interface ReportState {
  draft: ReportDraft;
  /** Current step index (0 = category, 1 = details, 2 = location, 3 = review) */
  currentStep: number;
  isSubmitting: boolean;
}

interface ReportActions {
  setCategoryId: (categoryId: string) => void;
  setSubcategoryId: (subcategoryId: string | null) => void;
  setDescription: (description: string) => void;
  addPhoto: (uri: string) => void;
  removePhoto: (uri: string) => void;
  setLocation: (lat: number, lng: number, address: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  /** Reset the draft and step back to 0. */
  reset: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export const useReportStore = create<ReportState & ReportActions>()(
  (set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────
    draft: { ...DEFAULT_DRAFT },
    currentStep: 0,
    isSubmitting: false,

    // ── Actions ────────────────────────────────────────────────────────────
    setCategoryId: (categoryId) =>
      set((state) => ({ draft: { ...state.draft, categoryId } })),

    setSubcategoryId: (subcategoryId) =>
      set((state) => ({ draft: { ...state.draft, subcategoryId } })),

    setDescription: (description) =>
      set((state) => ({ draft: { ...state.draft, description } })),

    addPhoto: (uri) =>
      set((state) => ({
        draft: { ...state.draft, photos: [...state.draft.photos, uri] },
      })),

    removePhoto: (uri) =>
      set((state) => ({
        draft: {
          ...state.draft,
          photos: state.draft.photos.filter((p) => p !== uri),
        },
      })),

    setLocation: (lat, lng, address) =>
      set((state) => ({
        draft: {
          ...state.draft,
          latitude: lat,
          longitude: lng,
          address,
        },
      })),

    nextStep: () => {
      const { currentStep } = get();
      if (currentStep < 3) {
        set({ currentStep: currentStep + 1 });
      }
    },

    prevStep: () => {
      const { currentStep } = get();
      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 });
      }
    },

    setStep: (step) => set({ currentStep: step }),

    reset: () =>
      set({
        draft: { ...DEFAULT_DRAFT },
        currentStep: 0,
        isSubmitting: false,
      }),

    setSubmitting: (isSubmitting) => set({ isSubmitting }),
  }),
);
