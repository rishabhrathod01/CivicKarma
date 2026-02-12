import type { PointAction } from '../types';
import { POINTS_CONFIG } from '../constants/points';

// ─── Points Utility Functions ────────────────────────────────────────────────

/**
 * Look up the point value for a given action from the POINTS_CONFIG.
 * Returns 0 if the action is not found.
 */
export function getPointsForAction(action: PointAction): number {
  const entry = POINTS_CONFIG.find((c) => c.action === action);
  return entry?.points ?? 0;
}

/**
 * Format a points value with its sign.
 * @example formatPoints(10) → "+10"
 * @example formatPoints(-20) → "-20"
 * @example formatPoints(0) → "0"
 */
export function formatPoints(points: number): string {
  if (points > 0) return `+${points}`;
  if (points < 0) return `${points}`;
  return '0';
}

/**
 * Return a colour string based on whether points are positive, negative, or zero.
 * Uses hex values that work well with both NativeWind and plain RN styles.
 */
export function getPointsColor(points: number): string {
  if (points > 0) return '#22C55E'; // green-500
  if (points < 0) return '#EF4444'; // red-500
  return '#6B7280'; // gray-500
}

/**
 * Return a label and colour for the given leaderboard rank.
 */
export function getRankBadge(rank: number): { label: string; color: string } {
  switch (rank) {
    case 1:
      return { label: 'Gold', color: '#EAB308' }; // yellow-500
    case 2:
      return { label: 'Silver', color: '#9CA3AF' }; // gray-400
    case 3:
      return { label: 'Bronze', color: '#D97706' }; // amber-600
    default:
      if (rank <= 10) return { label: 'Top 10', color: '#3B82F6' }; // blue-500
      if (rank <= 50) return { label: 'Top 50', color: '#8B5CF6' }; // violet-500
      return { label: 'Participant', color: '#6B7280' }; // gray-500
  }
}
