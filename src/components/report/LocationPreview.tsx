import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface LocationPreviewProps {
  latitude: number;
  longitude: number;
  address: string | null;
  onRefresh: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const LocationPreview: React.FC<LocationPreviewProps> = ({
  latitude,
  longitude,
  address,
  onRefresh,
}) => {
  const { t } = useTranslation();

  const displayText =
    address ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  return (
    <View className="flex-row items-center rounded-lg border border-gray-200 bg-gray-50 p-3">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
        <Ionicons name="location" size={20} color="#1a7f37" />
      </View>

      <View className="flex-1">
        <Text className="text-xs font-medium text-gray-500">
          {t('report.location', 'Location')}
        </Text>
        <Text className="mt-0.5 text-sm text-gray-800" numberOfLines={2}>
          {displayText}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onRefresh}
        activeOpacity={0.7}
        className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-white"
      >
        <Ionicons name="refresh" size={16} color="#656d76" />
      </TouchableOpacity>
    </View>
  );
};
