import React from 'react';
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type KeyboardTypeOptions,
} from 'react-native';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface InputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  editable?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  maxLength,
  keyboardType,
  leftIcon,
  rightIcon,
  editable = true,
  className,
  ...rest
}) => {
  const hasError = !!error;

  return (
    <View className={`mb-4 ${className ?? ''}`}>
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center rounded-lg border bg-white px-3
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${!editable ? 'bg-gray-100 opacity-60' : ''}
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          editable={editable}
          className={`
            flex-1 py-3 text-sm text-gray-900
            ${multiline ? 'min-h-[100px] text-start' : ''}
          `}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />

        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {hasError && (
        <Text className="mt-1 text-xs text-red-500">{error}</Text>
      )}

      {maxLength && (
        <Text className="mt-1 text-right text-xs text-gray-400">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};
