import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface SubcategoryChipProps {
  name: string;
  nameKn: string;
  isSelected: boolean;
  onPress: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const SubcategoryChip: React.FC<SubcategoryChipProps> = ({
  name,
  nameKn,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        mb-2 mr-2 rounded-full border px-4 py-2
        ${
          isSelected
            ? 'border-primary-500 bg-primary-500'
            : 'border-gray-300 bg-white'
        }
      `}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? 'text-white' : 'text-gray-700'
        }`}
      >
        {name}
      </Text>
      <Text
        className={`text-[10px] ${
          isSelected ? 'text-primary-100' : 'text-gray-400'
        }`}
      >
        {nameKn}
      </Text>
    </TouchableOpacity>
  );
};
