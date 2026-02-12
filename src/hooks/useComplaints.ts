import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintsService } from '../services/complaints';
import type { ComplaintWithPhotos, ReportDraft } from '../types';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const complaintKeys = {
  all: ['complaints'] as const,
  lists: () => [...complaintKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) =>
    [...complaintKeys.lists(), params] as const,
  details: () => [...complaintKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintKeys.details(), id] as const,
  mine: (userId: string) => [...complaintKeys.all, 'mine', userId] as const,
  duplicateCheck: () => [...complaintKeys.all, 'duplicateCheck'] as const,
};

// ─── Query Param Types ───────────────────────────────────────────────────────

export interface ComplaintsListParams {
  status?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated / filtered list of complaints.
 */
export function useComplaints(params: ComplaintsListParams = {}) {
  return useQuery<ComplaintWithPhotos[]>({
    queryKey: complaintKeys.list(params as Record<string, unknown>),
    queryFn: () => complaintsService.getComplaints(params),
  });
}

/**
 * Fetch a single complaint by its ID.
 */
export function useComplaintById(id: string) {
  return useQuery<ComplaintWithPhotos>({
    queryKey: complaintKeys.detail(id),
    queryFn: () => complaintsService.getComplaintById(id),
    enabled: !!id,
  });
}

/**
 * Fetch all complaints filed by a specific user.
 */
export function useMyComplaints(userId: string) {
  return useQuery<ComplaintWithPhotos[]>({
    queryKey: complaintKeys.mine(userId),
    queryFn: () => complaintsService.getMyComplaints(userId),
    enabled: !!userId,
  });
}

/**
 * Create a new complaint (mutation).
 * Automatically invalidates relevant query caches on success.
 */
export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: ReportDraft) =>
      complaintsService.createComplaint(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.lists() });
    },
  });
}

/**
 * Check whether a similar complaint already exists nearby (mutation).
 */
export function useCheckDuplicate() {
  return useMutation({
    mutationFn: (params: {
      categoryId: string;
      latitude: number;
      longitude: number;
    }) => complaintsService.checkDuplicate(params),
  });
}
