import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

// ─── Component ──────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#1a7f37" />
      <Text className="mt-3 text-sm text-gray-500">
        {t('common.loading', 'Loading...')}
      </Text>
    </View>
  );
};
