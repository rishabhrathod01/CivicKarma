import React from 'react';
import { View, Text } from 'react-native';

import type { ComplaintStatus } from '@/types/complaints';
import { COMPLAINT_STATUS_LABELS } from '@/types/complaints';
import { formatDateTime } from '@utils/format';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface StatusHistoryEntry {
  status: ComplaintStatus;
  timestamp: string;
  notes?: string | null;
}

export interface StatusTimelineProps {
  history: StatusHistoryEntry[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ history }) => {
  // Show most recent at top
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <View className="pl-2">
      {sorted.map((entry, index) => {
        const statusInfo = COMPLAINT_STATUS_LABELS[entry.status];
        const isLast = index === sorted.length - 1;

        return (
          <View key={`${entry.status}-${entry.timestamp}`} className="flex-row">
            {/* Vertical line + dot */}
            <View className="mr-3 items-center">
              {/* Dot */}
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: statusInfo.color }}
              />
              {/* Connecting line */}
              {!isLast && (
                <View className="w-0.5 flex-1 bg-gray-200" />
              )}
            </View>

            {/* Content */}
            <View className={`flex-1 ${!isLast ? 'pb-5' : 'pb-1'}`}>
              <Text
                className="text-sm font-semibold"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.label}
              </Text>

              <Text className="mt-0.5 text-xs text-gray-400">
                {formatDateTime(entry.timestamp)}
              </Text>

              {entry.notes && (
                <Text className="mt-1 text-xs text-gray-600">
                  {entry.notes}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
