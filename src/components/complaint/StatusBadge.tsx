import React from 'react';

import { Badge } from '@components/ui/Badge';
import {
  type ComplaintStatus,
  COMPLAINT_STATUS_LABELS,
} from '@/types/complaints';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  status: ComplaintStatus;
}

// ─── Status → Badge Variant Mapping ─────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const statusVariant: Record<ComplaintStatus, BadgeVariant> = {
  submitted: 'info',
  forwarded: 'warning',
  acknowledged: 'warning',
  resolved: 'success',
  rejected: 'danger',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const info = COMPLAINT_STATUS_LABELS[status];

  return (
    <Badge
      text={info.label}
      variant={statusVariant[status]}
      size="sm"
    />
  );
};
