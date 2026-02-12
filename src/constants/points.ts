import type { PointAction, PointsConfig } from '@/types/points';

// ─── Points Configuration ────────────────────────────────────────────────────

export const POINTS_CONFIG: PointsConfig[] = [
  {
    action: 'valid_report',
    points: 10,
    label: 'Valid Report',
    labelKn: 'ಮಾನ್ಯ ವರದಿ',
    description: 'Points awarded for submitting a verified civic report.',
  },
  {
    action: 'self_cleaned',
    points: 30,
    label: 'Self Cleaned',
    labelKn: 'ಸ್ವಯಂ ಸ್ವಚ್ಛಗೊಳಿಸಿದ',
    description: 'Bonus points for cleaning up the issue yourself.',
  },
  {
    action: 'parking_violation',
    points: 15,
    label: 'Parking Violation',
    labelKn: 'ಪಾರ್ಕಿಂಗ್ ಉಲ್ಲಂಘನೆ',
    description: 'Points awarded for reporting a parking violation.',
  },
  {
    action: 'false_report',
    points: -20,
    label: 'False Report',
    labelKn: 'ತಪ್ಪು ವರದಿ',
    description: 'Points deducted for submitting a false or duplicate report.',
  },
  {
    action: 'govt_resolved',
    points: 5,
    label: 'Government Resolved',
    labelKn: 'ಸರ್ಕಾರ ಪರಿಹರಿಸಿದೆ',
    description: 'Points awarded when your report is resolved by the government.',
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Look up the point value for a given action.
 * Returns 0 if the action is not found in the config.
 */
export function getPointsForAction(action: PointAction): number {
  const entry = POINTS_CONFIG.find((c) => c.action === action);
  return entry?.points ?? 0;
}
