import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface RankBadgeProps {
  rank: number;
}

// ─── Rank Config ────────────────────────────────────────────────────────────

const TOP_RANKS: Record<number, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  1: { icon: 'trophy', color: '#F59E0B', bg: 'bg-amber-100' },     // Gold
  2: { icon: 'medal', color: '#94A3B8', bg: 'bg-gray-100' },       // Silver
  3: { icon: 'medal', color: '#D97706', bg: 'bg-orange-100' },     // Bronze
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  const topRank = TOP_RANKS[rank];

  if (topRank) {
    return (
      <View
        className={`h-8 w-8 items-center justify-center rounded-full ${topRank.bg}`}
      >
        <Ionicons name={topRank.icon} size={18} color={topRank.color} />
      </View>
    );
  }

  return (
    <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-50">
      <Text className="text-xs font-bold text-gray-500">#{rank}</Text>
    </View>
  );
};
