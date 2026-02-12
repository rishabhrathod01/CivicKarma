import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 30;

export default function VerifyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { verifyOtp, signIn, isLoading } = useAuth();

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert(t('common.error'), t('auth.invalidOtp'));
      return;
    }

    try {
      await verifyOtp(phone ?? '', otp);
      router.replace('/(tabs)');
    } catch {
      Alert.alert(t('common.error'), t('auth.invalidOtp'));
      setOtp('');
    }
  }, [otp, phone, verifyOtp, router, t]);

  const handleResend = useCallback(async () => {
    if (!canResend || !phone) return;

    try {
      await signIn(phone);
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setOtp('');
    } catch {
      Alert.alert(t('common.error'), t('auth.loginError'));
    }
  }, [canResend, phone, signIn, t]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.otpLabel')}
            </Text>
            <Text className="text-base text-gray-500 text-center">
              {t('auth.otpSent', { phone: phone ?? '' })}
            </Text>
          </View>

          {/* OTP Input */}
          <View className="mb-6">
            <TextInput
              ref={inputRef}
              className="border border-gray-300 rounded-xl px-4 py-4 text-center text-2xl tracking-[12px] font-bold text-gray-900 bg-gray-50"
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={setOtp}
              editable={!isLoading}
              autoFocus
              placeholder="------"
              placeholderTextColor="#D1D5DB"
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center mb-6 ${
              isLoading || otp.length !== OTP_LENGTH
                ? 'bg-emerald-300'
                : 'bg-emerald-600'
            }`}
            onPress={handleVerify}
            disabled={isLoading || otp.length !== OTP_LENGTH}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t('auth.verifyOtp')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View className="items-center">
            {canResend ? (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text className="text-emerald-600 font-semibold text-sm">
                  {t('auth.resendOtp')}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-400 text-sm">
                {t('auth.resendIn', { seconds: countdown })}
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
