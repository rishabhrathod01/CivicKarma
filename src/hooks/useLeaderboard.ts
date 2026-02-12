import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '../services/leaderboard';
import type { LeaderboardEntry } from '../types';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (limit: number) => [...leaderboardKeys.all, 'list', limit] as const,
  userRank: (userId: string) =>
    [...leaderboardKeys.all, 'rank', userId] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch the top-N leaderboard entries.
 * @param limit – Number of entries to return (default 20).
 */
export function useLeaderboard(limit = 20) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: leaderboardKeys.list(limit),
    queryFn: () => leaderboardService.getLeaderboard(limit),
  });
}

/**
 * Fetch the rank and points for a specific user.
 */
export function useUserRank(userId: string) {
  return useQuery<LeaderboardEntry | null>({
    queryKey: leaderboardKeys.userRank(userId),
    queryFn: () => leaderboardService.getUserRank(userId),
    enabled: !!userId,
  });
}
