import React from 'react';
import { View, Text } from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

// ─── Variant Styles ─────────────────────────────────────────────────────────

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100',
  warning: 'bg-orange-100',
  danger: 'bg-red-100',
  info: 'bg-blue-100',
  neutral: 'bg-gray-100',
};

const variantTextClasses: Record<BadgeVariant, string> = {
  success: 'text-green-700',
  warning: 'text-orange-700',
  danger: 'text-red-700',
  info: 'text-blue-700',
  neutral: 'text-gray-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-3 py-1',
};

const sizeTextClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'neutral',
  size = 'md',
}) => {
  return (
    <View
      className={`
        self-start rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      <Text
        className={`
          font-semibold
          ${variantTextClasses[variant]}
          ${sizeTextClasses[size]}
        `}
      >
        {text}
      </Text>
    </View>
  );
};
