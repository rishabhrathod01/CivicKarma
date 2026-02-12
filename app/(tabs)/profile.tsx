import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../src/hooks/useAuth';
import { useAuthStore } from '../../src/stores/auth.store';
import { useSettingsStore } from '../../src/stores/settings.store';

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-xl font-bold text-gray-900">{value}</Text>
      <Text className="text-xs text-gray-500 mt-1">{label}</Text>
    </View>
  );
}

// ─── Settings Row ───────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  label,
  onPress,
  rightElement,
  destructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-3.5 border-b border-gray-50"
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? '#EF4444' : '#6B7280'}
      />
      <Text
        className={`flex-1 ml-3 text-base ${
          destructive ? 'text-red-500 font-medium' : 'text-gray-800'
        }`}
      >
        {label}
      </Text>
      {rightElement ?? (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
}

// ─── Profile Screen ─────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { language, setLanguage } = useSettingsStore();

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="bg-white px-5 pt-6 pb-6 items-center border-b border-gray-100">
          <View className="w-20 h-20 rounded-full bg-emerald-600 items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">
            {user?.name ?? t('profile.title')}
          </Text>
          {user?.phone && (
            <Text className="text-sm text-gray-500 mt-1">{user.phone}</Text>
          )}
        </View>

        {/* Stats Row */}
        <View className="flex-row px-5 mt-4 gap-3">
          <StatCard
            icon="star"
            label={t('profile.totalPoints')}
            value={user?.points ?? 0}
            color="#D97706"
          />
          <StatCard
            icon="document-text"
            label={t('profile.totalReports')}
            value={user?.total_reports ?? 0}
            color="#2563EB"
          />
        </View>

        {/* My Reports */}
        <View className="bg-white mx-5 mt-4 rounded-2xl px-4">
          <SettingsRow
            icon="document-text-outline"
            label={t('profile.myReports')}
            onPress={() => {
              /* TODO: navigate to my reports */
            }}
          />
        </View>

        {/* Settings */}
        <View className="mx-5 mt-6">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            {t('profile.settings')}
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingsRow
              icon="language-outline"
              label={t('profile.language')}
              onPress={toggleLanguage}
              rightElement={
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 mr-2">
                    {language === 'en'
                      ? t('profile.english')
                      : t('profile.kannada')}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </View>
              }
            />
            <SettingsRow
              icon="information-circle-outline"
              label={t('profile.about')}
              onPress={() => {
                /* TODO: navigate to about */
              }}
            />
            <SettingsRow
              icon="log-out-outline"
              label={t('profile.logout')}
              onPress={handleLogout}
              destructive
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
