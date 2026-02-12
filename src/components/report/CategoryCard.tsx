import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface CategoryCardProps {
  name: string;
  nameKn: string;
  icon: string;
  subcategoryCount: number;
  isSelected: boolean;
  onPress: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  nameKn,
  icon,
  subcategoryCount,
  isSelected,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        rounded-xl border-2 bg-white p-4
        ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
      `}
    >
      <View className="mb-2 h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color="#1a7f37"
        />
      </View>

      <Text className="text-sm font-semibold text-gray-900">{name}</Text>
      <Text className="mt-0.5 text-xs text-gray-500">{nameKn}</Text>

      <Text className="mt-2 text-[10px] text-gray-400">
        {subcategoryCount}{' '}
        {t('report.subcategories', 'subcategories')}
      </Text>
    </TouchableOpacity>
  );
};
