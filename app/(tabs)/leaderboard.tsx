import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LeaderboardEntry } from '../../src/types/points';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_CURRENT_USER: LeaderboardEntry = {
  userId: 'current-user',
  name: 'You',
  avatarUrl: null,
  points: 120,
  totalReports: 8,
  rank: 4,
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: '1',
    name: 'Priya Sharma',
    avatarUrl: null,
    points: 450,
    totalReports: 32,
    rank: 1,
  },
  {
    userId: '2',
    name: 'Rahul Gowda',
    avatarUrl: null,
    points: 380,
    totalReports: 25,
    rank: 2,
  },
  {
    userId: '3',
    name: 'Ananya Rao',
    avatarUrl: null,
    points: 290,
    totalReports: 18,
    rank: 3,
  },
  {
    userId: 'current-user',
    name: 'You',
    avatarUrl: null,
    points: 120,
    totalReports: 8,
    rank: 4,
  },
  {
    userId: '5',
    name: 'Karthik Reddy',
    avatarUrl: null,
    points: 95,
    totalReports: 6,
    rank: 5,
  },
  {
    userId: '6',
    name: 'Meera Nair',
    avatarUrl: null,
    points: 70,
    totalReports: 4,
    rank: 6,
  },
];

// ─── Rank Badge ─────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Text className="text-2xl">🥇</Text>;
  }
  if (rank === 2) {
    return <Text className="text-2xl">🥈</Text>;
  }
  if (rank === 3) {
    return <Text className="text-2xl">🥉</Text>;
  }

  return (
    <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
      <Text className="text-sm font-bold text-gray-500">#{rank}</Text>
    </View>
  );
}

// ─── Leaderboard Card ───────────────────────────────────────────────────────

function LeaderboardCard({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const { t } = useTranslation();

  return (
    <View
      className={`flex-row items-center px-4 py-3.5 mb-2 rounded-xl ${
        isCurrentUser ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-100'
      }`}
    >
      <RankBadge rank={entry.rank} />

      {/* Avatar */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ml-3 ${
          isCurrentUser ? 'bg-emerald-600' : 'bg-gray-200'
        }`}
      >
        <Text className={`font-bold ${isCurrentUser ? 'text-white' : 'text-gray-500'}`}>
          {entry.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Name & Reports */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-sm font-semibold text-gray-900">
            {isCurrentUser ? t('leaderboard.you') : entry.name}
          </Text>
          {isCurrentUser && (
            <View className="bg-emerald-600 rounded-full px-2 py-0.5 ml-2">
              <Text className="text-[10px] font-bold text-white">
                {t('leaderboard.you')}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-xs text-gray-400 mt-0.5">
          {entry.totalReports} {t('leaderboard.reports').toLowerCase()}
        </Text>
      </View>

      {/* Points */}
      <View className="items-end">
        <Text className="text-base font-bold text-emerald-600">
          {entry.points}
        </Text>
        <Text className="text-[10px] text-gray-400">
          {t('leaderboard.points').toLowerCase()}
        </Text>
      </View>
    </View>
  );
}

// ─── Leaderboard Screen ─────────────────────────────────────────────────────

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="trophy" size={24} color="#D97706" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">
            {t('leaderboard.title')}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 mt-1">
          {t('leaderboard.subtitle')}
        </Text>
      </View>

      {/* Current User Rank Card */}
      <View className="px-4 pt-4">
        <View className="bg-emerald-600 rounded-2xl p-4 flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
            <Text className="text-xl font-bold text-white">
              #{MOCK_CURRENT_USER.rank}
            </Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-bold text-base">
              {t('leaderboard.yourRank', { rank: MOCK_CURRENT_USER.rank })}
            </Text>
            <Text className="text-emerald-100 text-sm mt-0.5">
              {t('leaderboard.yourPoints', { points: MOCK_CURRENT_USER.points })}
            </Text>
          </View>
          <Ionicons name="arrow-up-circle" size={28} color="#ffffff" />
        </View>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={MOCK_LEADERBOARD}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <LeaderboardCard
            entry={item}
            isCurrentUser={item.userId === MOCK_CURRENT_USER.userId}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1a7f37"
            colors={['#1a7f37']}
          />
        }
      />
    </SafeAreaView>
  );
}
