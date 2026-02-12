import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEFAULT_CATEGORIES } from '../../src/constants/categories';
import { useReportStore } from '../../src/stores/report.store';

// ─── Subcategory Chip ───────────────────────────────────────────────────────

function SubcategoryChip({
  name,
  isSelected,
  onPress,
}: {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2.5 rounded-xl mr-2 mb-2 border ${
        isSelected
          ? 'bg-emerald-600 border-emerald-600'
          : 'bg-white border-gray-200'
      }`}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? 'text-white' : 'text-gray-700'
        }`}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Category Screen ────────────────────────────────────────────────────────

export default function CategoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { categoryId: paramCategoryId } = useLocalSearchParams<{
    categoryId: string;
  }>();

  const { draft, setCategoryId, setSubcategoryId } = useReportStore();

  // Find the matching category
  const category = DEFAULT_CATEGORIES.find(
    (c) => c.department === (paramCategoryId ?? draft.categoryId),
  );

  const selectedSubcategory = draft.subcategoryId;

  const handleSubcategoryPress = (subcategoryName: string) => {
    if (selectedSubcategory === subcategoryName) {
      setSubcategoryId(null);
    } else {
      setSubcategoryId(subcategoryName);
    }
  };

  const handleNext = () => {
    router.push('/report/details');
  };

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={[]}>
        <Text className="text-gray-500">{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Header */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900">
            {category.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {t('report.selectSubcategory')}
          </Text>
        </View>

        {/* Subcategory Chips */}
        <View className="flex-row flex-wrap">
          {category.subcategories.map((sub) => (
            <SubcategoryChip
              key={sub.name}
              name={sub.name}
              isSelected={selectedSubcategory === sub.name}
              onPress={() => handleSubcategoryPress(sub.name)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${
            selectedSubcategory ? 'bg-emerald-600' : 'bg-gray-200'
          }`}
          onPress={handleNext}
          disabled={!selectedSubcategory}
          activeOpacity={0.8}
        >
          <Text
            className={`font-semibold text-base ${
              selectedSubcategory ? 'text-white' : 'text-gray-400'
            }`}
          >
            {t('common.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
