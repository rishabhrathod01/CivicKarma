import type { PointAction } from '../types/points';
import { supabase } from './supabase';

export const pointsService = {
  /**
   * Award points for a given action by calling the `award_points` DB function.
   * Returns the number of points awarded.
   */
  async awardPoints(
    userId: string,
    complaintId: string,
    action: PointAction,
  ): Promise<number> {
    const { data, error } = await supabase.rpc('award_points', {
      p_user_id: userId,
      p_complaint_id: complaintId,
      p_action: action,
    });

    if (error) throw error;
    return data as number;
  },

  /**
   * Fetch a user's points history from the `points_log` table.
   */
  async getPointsHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('points_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Check whether the user can still submit reports today.
   * Calls the `check_daily_limit` DB function and returns `true` if allowed.
   */
  async checkDailyLimit(userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('check_daily_limit', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data as boolean;
  },

  /**
   * Increment the user's daily and total report counts after a successful
   * complaint submission by calling `increment_report_count`.
   */
  async incrementReportCount(userId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_report_count', {
      p_user_id: userId,
    });

    if (error) throw error;
  },
};
