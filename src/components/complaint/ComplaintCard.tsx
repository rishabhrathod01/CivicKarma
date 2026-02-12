import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ComplaintWithPhotos } from '@/types/complaints';
import { truncateText, formatRelativeTime } from '@utils/format';
import { StatusBadge } from './StatusBadge';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface ComplaintCardProps {
  complaint: ComplaintWithPhotos;
  onPress: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onPress,
}) => {
  const firstPhoto = complaint.photos[0]?.photo_url ?? null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 flex-row rounded-xl border border-gray-100 bg-white p-3"
    >
      {/* Thumbnail */}
      {firstPhoto && (
        <Image
          source={{ uri: firstPhoto }}
          className="mr-3 h-20 w-20 rounded-lg"
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View className="flex-1 justify-between">
        {/* Top: category + status */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-primary-600">
            {complaint.category_name}
          </Text>
          <StatusBadge status={complaint.status} />
        </View>

        {/* Description */}
        <Text className="mt-1 text-sm text-gray-700" numberOfLines={2}>
          {truncateText(complaint.description, 80)}
        </Text>

        {/* Bottom: time + location */}
        <View className="mt-2 flex-row items-center">
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text className="ml-1 text-[10px] text-gray-400">
            {formatRelativeTime(complaint.created_at)}
          </Text>

          {complaint.address && (
            <>
              <Ionicons
                name="location-outline"
                size={12}
                color="#9CA3AF"
                style={{ marginLeft: 8 }}
              />
              <Text
                className="ml-1 flex-1 text-[10px] text-gray-400"
                numberOfLines={1}
              >
                {complaint.address}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
