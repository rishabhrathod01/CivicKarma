import type { LeaderboardEntry } from '../types/points';
import { supabase } from './supabase';

export const leaderboardService = {
  /**
   * Fetch the ranked leaderboard by calling the `get_leaderboard` DB function.
   */
  async getLeaderboard(
    limit = 20,
    offset = 0,
  ): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase.rpc('get_leaderboard', {
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;

    // Map the snake_case DB response to our camelCase LeaderboardEntry type
    return ((data as Record<string, unknown>[]) ?? []).map((row) => ({
      userId: row.user_id as string,
      name: row.name as string,
      avatarUrl: (row.avatar_url as string) ?? null,
      points: row.points as number,
      totalReports: row.total_reports as number,
      rank: row.rank as number,
    }));
  },

  /**
   * Get a specific user's rank and points.
   * We fetch the full leaderboard position for the user by filtering on their row.
   */
  async getUserRank(
    userId: string,
  ): Promise<{ rank: number; points: number } | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Count how many users have more points to derive rank
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gt('points', data.points);

    if (countError) throw countError;

    return {
      rank: (count ?? 0) + 1,
      points: data.points,
    };
  },
};
