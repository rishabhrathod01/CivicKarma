import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface PhotoGridProps {
  photos: string[];
  onRemove: (index: number) => void;
  onAdd: () => void;
  maxPhotos?: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onRemove,
  onAdd,
  maxPhotos = 5,
}) => {
  const { t } = useTranslation();
  const canAddMore = photos.length < maxPhotos;

  return (
    <View className="flex-row flex-wrap gap-3">
      {photos.map((uri, index) => (
        <View key={uri} className="relative h-24 w-24 rounded-lg">
          <Image
            source={{ uri }}
            className="h-full w-full rounded-lg"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => onRemove(index)}
            className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
          >
            <Ionicons name="close" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ))}

      {canAddMore && (
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.7}
          className="h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
          <Text className="mt-1 text-[10px] text-gray-400">
            {t('report.addPhoto', 'Add Photo')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
