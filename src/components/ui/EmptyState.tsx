import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Button } from './Button';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Ionicons name={icon} size={56} color="#9CA3AF" />

      <Text className="mt-4 text-center text-lg font-semibold text-gray-700">
        {title}
      </Text>

      <Text className="mt-2 text-center text-sm text-gray-500">
        {message}
      </Text>

      {actionLabel && onAction && (
        <View className="mt-6">
          <Button title={actionLabel} onPress={onAction} variant="primary" />
        </View>
      )}
    </View>
  );
};
