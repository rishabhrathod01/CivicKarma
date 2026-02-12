import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useReportStore } from '../../src/stores/report.store';
import { getPointsForAction } from '../../src/constants/points';

export default function SuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { complaintId } = useLocalSearchParams<{ complaintId: string }>();
  const reset = useReportStore((s) => s.reset);

  const pointsEarned = getPointsForAction('valid_report');

  const handleViewReport = () => {
    reset();
    router.replace({
      pathname: '/complaint/[id]',
      params: { id: complaintId ?? '' },
    });
  };

  const handleReportAnother = () => {
    reset();
    router.replace('/(tabs)/report');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        {/* Success Icon */}
        <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t('report.successTitle')}
        </Text>

        {/* Points Message */}
        <Text className="text-base text-gray-500 text-center mb-2">
          {t('report.successMessage', { points: pointsEarned })}
        </Text>

        {/* Points Badge */}
        <View className="flex-row items-center bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-10">
          <Ionicons name="star" size={18} color="#D97706" />
          <Text className="text-amber-700 font-bold ml-1.5">
            +{pointsEarned} {t('leaderboard.points')}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          className="bg-emerald-600 rounded-xl py-4 w-full items-center mb-3"
          onPress={handleViewReport}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {t('report.viewReport')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 rounded-xl py-4 w-full items-center"
          onPress={handleReportAnother}
          activeOpacity={0.7}
        >
          <Text className="text-gray-700 font-semibold text-base">
            {t('report.reportAnother')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
