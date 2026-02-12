import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function ReportFlowLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
          color: '#111827',
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="category"
        options={{ title: 'Select Category' }}
      />
      <Stack.Screen
        name="details"
        options={{ title: 'Add Details' }}
      />
      <Stack.Screen
        name="review"
        options={{ title: 'Review Report' }}
      />
      <Stack.Screen
        name="success"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
