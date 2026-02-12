import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../../src/stores/auth.store';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';
import { APP_CONFIG } from '../../src/constants/config';
import { useReportStore } from '../../src/stores/report.store';

// ─── Category Card Icons (using Ionicons) ───────────────────────────────────

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  bbmp: 'business-outline',
  traffic: 'car-outline',
  road_infra: 'construct-outline',
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  bbmp: { bg: '#DBEAFE', icon: '#2563EB' },
  traffic: { bg: '#FEF3C7', icon: '#D97706' },
  road_infra: { bg: '#FCE7F3', icon: '#DB2777' },
};

// ─── Category Card ──────────────────────────────────────────────────────────

function CategoryCard({
  name,
  department,
  subcategoryCount,
  onPress,
}: {
  name: string;
  department: string;
  subcategoryCount: number;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const colors = CATEGORY_COLORS[department] ?? {
    bg: '#F3F4F6',
    icon: '#6B7280',
  };
  const iconName = CATEGORY_ICONS[department] ?? 'help-outline';

  return (
    <TouchableOpacity
      className="bg-white border border-gray-100 rounded-2xl p-5 mb-3 shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View
          className="w-14 h-14 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name={iconName} size={28} color={colors.icon} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{name}</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {subcategoryCount} {t('report.selectSubcategory').toLowerCase()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Report Screen ──────────────────────────────────────────────────────────

export default function ReportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setCategoryId, reset } = useReportStore();
  const user = useAuthStore((s) => s.user);

  const dailyCount = user?.daily_report_count ?? 0;
  const dailyLimit = APP_CONFIG.MAX_REPORTS_PER_DAY;

  const handleCategoryPress = (categoryIndex: number) => {
    reset();
    const category = DEFAULT_CATEGORIES[categoryIndex];
    setCategoryId(category.department);
    router.push({
      pathname: '/report/category',
      params: { categoryId: category.department },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1 px-5 pt-6">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-900">
          {t('report.title')}
        </Text>
        <Text className="text-sm text-gray-500 mt-1 mb-6">
          {t('auth.tagline')}
        </Text>

        {/* Daily Limit Counter */}
        <View className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex-row items-center mb-6">
          <Ionicons name="document-text-outline" size={20} color="#1a7f37" />
          <Text className="text-sm text-emerald-800 ml-2 flex-1">
            {dailyCount} / {dailyLimit} {t('report.title').toLowerCase()}
          </Text>
          {dailyCount >= dailyLimit && (
            <Text className="text-xs text-red-500 font-medium">
              {t('report.dailyLimitReached', { limit: dailyLimit })}
            </Text>
          )}
        </View>

        {/* Category Cards */}
        {DEFAULT_CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.department}
            name={category.name}
            department={category.department}
            subcategoryCount={category.subcategories.length}
            onPress={() => handleCategoryPress(index)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
