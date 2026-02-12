import React from 'react';
import { View, Text, Image } from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  uri: string | null;
  name: string;
  size?: AvatarSize;
}

// ─── Size Styles ────────────────────────────────────────────────────────────

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const textSizeClasses: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
};

// Simple hash to pick a consistent background color from name
const COLORS = [
  'bg-primary-400',
  'bg-blue-400',
  'bg-orange-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-purple-400',
  'bg-red-400',
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
}) => {
  const initials = name.trim().charAt(0).toUpperCase();
  const bgColor = getColorForName(name);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`rounded-full ${sizeClasses[size]}`}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      className={`
        items-center justify-center rounded-full
        ${sizeClasses[size]}
        ${bgColor}
      `}
    >
      <Text className={`font-bold text-white ${textSizeClasses[size]}`}>
        {initials}
      </Text>
    </View>
  );
};
