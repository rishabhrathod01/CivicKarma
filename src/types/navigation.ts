// ─── Expo Router Route Parameters ────────────────────────────────────────────
//
// Param types for each route in the app.
// Use these with `useLocalSearchParams<T>()` from expo-router.
//
// Example:
//   import { useLocalSearchParams } from 'expo-router';
//   import type { ComplaintDetailParams } from '@/types/navigation';
//   const { id } = useLocalSearchParams<ComplaintDetailParams>();
// ─────────────────────────────────────────────────────────────────────────────

/** /complaint/[id] */
export type ComplaintDetailParams = { id: string };

/** /report/category – no params needed */
export type ReportCategoryParams = Record<string, never>;

/** /report/details */
export type ReportDetailsParams = { categoryId: string; subcategoryId?: string };

/** /report/review – uses Zustand store, no route params */
export type ReportReviewParams = Record<string, never>;

/** /report/success */
export type ReportSuccessParams = { complaintId: string };

/**
 * Union map of all app routes to their param types.
 * Useful for building a generic navigation helper.
 */
export type AppRouteParams = {
  '/complaint/[id]': ComplaintDetailParams;
  '/report/category': ReportCategoryParams;
  '/report/details': ReportDetailsParams;
  '/report/review': ReportReviewParams;
  '/report/success': ReportSuccessParams;
};
