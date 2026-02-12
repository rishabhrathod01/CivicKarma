import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

// ─── Variant Styles ─────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-gray-200 active:bg-gray-300',
  outline: 'bg-transparent border border-primary-500 active:bg-primary-50',
  ghost: 'bg-transparent active:bg-primary-50',
  danger: 'bg-red-600 active:bg-red-700',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-800',
  outline: 'text-primary-500',
  ghost: 'text-primary-500',
  danger: 'text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3.5',
};

const sizeTextClasses: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center rounded-lg
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${isDisabled ? 'opacity-50' : ''}
        ${className ?? ''}
      `}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#1f2937' : '#ffffff'}
          className="mr-2"
        />
      ) : icon ? (
        <>{icon}</>
      ) : null}

      <Text
        className={`
          font-semibold
          ${sizeTextClasses[size]}
          ${variantTextClasses[variant]}
          ${icon || loading ? 'ml-2' : ''}
        `}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
