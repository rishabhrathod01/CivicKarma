import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@components/ui/Avatar';
import { RankBadge } from './RankBadge';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface LeaderboardCardProps {
  rank: number;
  name: string;
  avatarUrl: string | null;
  points: number;
  totalReports: number;
  isCurrentUser: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  rank,
  name,
  avatarUrl,
  points,
  totalReports,
  isCurrentUser,
}) => {
  const { t } = useTranslation();

  return (
    <View
      className={`
        flex-row items-center rounded-xl border px-4 py-3
        ${isCurrentUser ? 'border-primary-300 bg-primary-50' : 'border-gray-100 bg-white'}
      `}
    >
      {/* Rank */}
      <RankBadge rank={rank} />

      {/* Avatar */}
      <View className="mx-3">
        <Avatar uri={avatarUrl} name={name} size="sm" />
      </View>

      {/* Name & Reports */}
      <View className="flex-1">
        <Text
          className={`text-sm font-semibold ${
            isCurrentUser ? 'text-primary-700' : 'text-gray-900'
          }`}
          numberOfLines={1}
        >
          {name}
          {isCurrentUser && (
            <Text className="text-xs font-normal text-primary-500">
              {' '}({t('leaderboard.you', 'You')})
            </Text>
          )}
        </Text>
        <Text className="text-xs text-gray-500">
          {totalReports} {t('leaderboard.reports', 'reports')}
        </Text>
      </View>

      {/* Points */}
      <View className="items-end">
        <Text className="text-base font-bold text-primary-600">{points}</Text>
        <Text className="text-[10px] text-gray-400">
          {t('leaderboard.pts', 'pts')}
        </Text>
      </View>
    </View>
  );
};
