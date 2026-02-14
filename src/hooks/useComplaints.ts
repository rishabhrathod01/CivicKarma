import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../stores/auth.store';
import { mockComplaintsService } from '../services/mockData';
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

export function useComplaints(params: ComplaintsListParams = {}) {
  return useQuery<ComplaintWithPhotos[]>({
    queryKey: complaintKeys.list(params as Record<string, unknown>),
    queryFn: () =>
      mockComplaintsService.getComplaints({
        limit: params.limit,
        offset: params.offset,
        status: params.status as import('../types/complaints').ComplaintStatus,
        category: params.categoryId,
      }),
  });
}

export function useComplaintById(id: string) {
  return useQuery<ComplaintWithPhotos>({
    queryKey: complaintKeys.detail(id),
    queryFn: () => mockComplaintsService.getComplaintById(id),
    enabled: !!id,
  });
}

export function useMyComplaints(userId: string) {
  return useQuery<ComplaintWithPhotos[]>({
    queryKey: complaintKeys.mine(userId),
    queryFn: () => mockComplaintsService.getMyComplaints(userId),
    enabled: !!userId,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: ReportDraft) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return Promise.reject(new Error('Not authenticated'));
      return mockComplaintsService.createComplaint(draft, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.lists() });
    },
  });
}

export function useCheckDuplicate() {
  return useMutation({
    mutationFn: (params: {
      categoryId: string;
      latitude: number;
      longitude: number;
    }) =>
      mockComplaintsService.checkDuplicate(
        params.latitude,
        params.longitude,
        params.categoryId,
      ),
  });
}
