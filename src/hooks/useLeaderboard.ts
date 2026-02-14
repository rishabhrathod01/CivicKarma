import { useQuery } from '@tanstack/react-query';

import { mockLeaderboardService } from '../services/mockData';
import type { LeaderboardEntry } from '../types';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (limit: number) => [...leaderboardKeys.all, 'list', limit] as const,
  userRank: (userId: string) =>
    [...leaderboardKeys.all, 'rank', userId] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLeaderboard(limit = 20) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: leaderboardKeys.list(limit),
    queryFn: () => mockLeaderboardService.getLeaderboard(limit),
  });
}

export function useUserRank(userId: string) {
  return useQuery<LeaderboardEntry | null>({
    queryKey: leaderboardKeys.userRank(userId),
    queryFn: () => mockLeaderboardService.getUserRank(userId),
    enabled: !!userId,
  });
}
