import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'elevated';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  variant?: CardVariant;
}

// ─── Variant Styles ─────────────────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white rounded-xl border border-gray-100 p-4',
  elevated:
    'bg-white rounded-xl p-4 shadow-sm shadow-black/10 elevation-2',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onPress,
  variant = 'default',
}) => {
  const combinedClassName = `${variantClasses[variant]} ${className ?? ''}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={combinedClassName}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={combinedClassName}>{children}</View>;
};
