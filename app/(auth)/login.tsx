import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../src/hooks/useAuth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [phone, setPhone] = useState('');

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) {
      Alert.alert(t('common.error'), t('auth.invalidPhone'));
      return;
    }

    try {
      await signIn(`+91${cleaned}`);
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `+91${cleaned}` },
      });
    } catch {
      Alert.alert(t('common.error'), t('auth.loginError'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo & Branding */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-2xl bg-emerald-600 items-center justify-center mb-4">
              <Ionicons name="leaf" size={40} color="#ffffff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">
              {t('common.appName')}
            </Text>
            <Text className="text-base text-gray-500 mt-2 text-center">
              {t('auth.tagline')}
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t('auth.phoneLabel')}
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
              <Text className="text-base text-gray-600 mr-2 font-medium">
                +91
              </Text>
              <View className="w-px h-6 bg-gray-300 mr-3" />
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="XXXXX XXXXX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              isLoading || phone.replace(/\s/g, '').length < 10
                ? 'bg-emerald-300'
                : 'bg-emerald-600'
            }`}
            onPress={handleSendOtp}
            disabled={isLoading || phone.replace(/\s/g, '').length < 10}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t('auth.sendOtp')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
