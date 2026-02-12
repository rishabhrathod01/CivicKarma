import type { Tables } from './database';

// ─── Status & Department Enums ───────────────────────────────────────────────

export type ComplaintStatus =
  | 'submitted'
  | 'forwarded'
  | 'acknowledged'
  | 'resolved'
  | 'rejected';

export type Department = 'bbmp' | 'traffic' | 'road_infra';

// ─── Contractor Info ─────────────────────────────────────────────────────────

export interface ContractorInfo {
  name?: string;
  cost?: number;
  timeline?: string;
  responsibility?: string;
}

// ─── Joined Types ────────────────────────────────────────────────────────────

export interface ComplaintWithPhotos extends Tables<'complaints'> {
  photos: Tables<'complaint_photos'>[];
  category_name: string;
  category_name_kn: string;
  subcategory_name: string | null;
  subcategory_name_kn: string | null;
}

// ─── Report Draft (multi-step form) ─────────────────────────────────────────

export interface ReportDraft {
  categoryId: string;
  subcategoryId: string | null;
  description: string;
  /** Local file URIs for picked photos */
  photos: string[];
  latitude: number;
  longitude: number;
  address: string | null;
}

// ─── Status Label Mapping ───────────────────────────────────────────────────

export interface StatusLabelInfo {
  label: string;
  labelKn: string;
  color: string;
}

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, StatusLabelInfo> = {
  submitted: {
    label: 'Submitted',
    labelKn: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    color: '#3B82F6', // blue-500
  },
  forwarded: {
    label: 'Forwarded',
    labelKn: 'ಫಾರ್ವರ್ಡ್ ಮಾಡಲಾಗಿದೆ',
    color: '#F97316', // orange-500
  },
  acknowledged: {
    label: 'Acknowledged',
    labelKn: 'ಸ್ವೀಕೃತಿ',
    color: '#EAB308', // yellow-500
  },
  resolved: {
    label: 'Resolved',
    labelKn: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    color: '#22C55E', // green-500
  },
  rejected: {
    label: 'Rejected',
    labelKn: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    color: '#EF4444', // red-500
  },
};
