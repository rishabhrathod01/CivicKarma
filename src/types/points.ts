// ─── Point Action Types ──────────────────────────────────────────────────────

export type PointAction =
  | 'valid_report'
  | 'self_cleaned'
  | 'parking_violation'
  | 'false_report'
  | 'govt_resolved';

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl: string | null;
  points: number;
  totalReports: number;
  rank: number;
}

// ─── Points Config ───────────────────────────────────────────────────────────

export interface PointsConfig {
  action: PointAction;
  points: number;
  label: string;
  labelKn: string;
  description: string;
}
