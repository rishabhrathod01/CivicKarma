import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={label}>
            {/* Step dot & label */}
            <View className="items-center">
              <View
                className={`
                  h-7 w-7 items-center justify-center rounded-full
                  ${isCompleted ? 'bg-primary-500' : ''}
                  ${isCurrent ? 'border-2 border-primary-500 bg-white' : ''}
                  ${!isCompleted && !isCurrent ? 'border-2 border-gray-300 bg-white' : ''}
                `}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                ) : (
                  <Text
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <Text
                className={`mt-1 text-[10px] ${
                  isCurrent
                    ? 'font-semibold text-primary-600'
                    : isCompleted
                      ? 'text-primary-500'
                      : 'text-gray-400'
                }`}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <View
                className={`mx-1 h-0.5 flex-1 ${
                  index < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
