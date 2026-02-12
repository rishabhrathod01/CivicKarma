import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useComplaintById } from '../../src/hooks/useComplaints';
import {
  COMPLAINT_STATUS_LABELS,
  type ComplaintStatus,
} from '../../src/types/complaints';

// ─── Status Timeline ────────────────────────────────────────────────────────

const STATUS_ORDER: ComplaintStatus[] = [
  'submitted',
  'forwarded',
  'acknowledged',
  'resolved',
];

function StatusTimeline({ currentStatus }: { currentStatus: ComplaintStatus }) {
  const { t } = useTranslation();
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <View className="mt-4">
      <Text className="text-xs text-gray-400 uppercase tracking-wider mb-3">
        {t('complaint.timeline')}
      </Text>

      {isRejected ? (
        <View className="flex-row items-center bg-red-50 rounded-xl px-4 py-3">
          <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </View>
          <Text className="text-sm text-red-600 font-medium ml-3">
            {t('complaint.statusRejected')}
          </Text>
        </View>
      ) : (
        STATUS_ORDER.map((status, index) => {
          const statusInfo = COMPLAINT_STATUS_LABELS[status];
          const isCompleted = index <= currentIndex;
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <View key={status} className="flex-row">
              {/* Indicator */}
              <View className="items-center mr-3">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isCompleted ? '' : 'bg-gray-100'
                  }`}
                  style={isCompleted ? { backgroundColor: `${statusInfo.color}20` } : undefined}
                >
                  {isCompleted ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={statusInfo.color}
                    />
                  ) : (
                    <View className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </View>
                {!isLast && (
                  <View
                    className={`w-0.5 h-8 ${
                      isCompleted && index < currentIndex
                        ? 'bg-emerald-300'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </View>

              {/* Label */}
              <View className="flex-1 pb-4">
                <Text
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {statusInfo.label}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

// ─── Detail Row ─────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="py-3 border-b border-gray-50">
      <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-sm text-gray-800">{value}</Text>
    </View>
  );
}

// ─── Complaint Detail Screen ────────────────────────────────────────────────

export default function ComplaintDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: complaint, isLoading, error } = useComplaintById(id ?? '');

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t('complaint.details'),
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
            ),
          }}
        />
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#1a7f37" />
        </View>
      </>
    );
  }

  if (error || !complaint) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t('complaint.details'),
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
            ),
          }}
        />
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-base text-gray-500 mt-4 text-center">
            {t('common.error')}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-gray-100 rounded-xl px-6 py-3"
          >
            <Text className="text-gray-700 font-medium">{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const statusInfo = COMPLAINT_STATUS_LABELS[complaint.status];

  return (
    <>
      <Stack.Screen
        options={{
          title: t('complaint.details'),
          headerShown: true,
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: '600', fontSize: 17, color: '#111827' },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Photos Carousel */}
        {complaint.photos && complaint.photos.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="h-60"
          >
            {complaint.photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.photo_url }}
                className="w-screen h-60"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <View className="px-5 pt-5">
          {/* Status Badge */}
          <View className="flex-row items-center mb-4">
            <View
              className="rounded-full px-3 py-1.5"
              style={{ backgroundColor: `${statusInfo.color}20` }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.label}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View className="bg-gray-50 rounded-2xl px-4 py-1 mb-4">
            <DetailRow
              label={t('complaint.category')}
              value={complaint.category_name}
            />
            {complaint.subcategory_name && (
              <DetailRow
                label={t('report.selectSubcategory')}
                value={complaint.subcategory_name}
              />
            )}
            <DetailRow
              label={t('report.description')}
              value={complaint.description}
            />
            <DetailRow
              label={t('complaint.location')}
              value={
                complaint.address ??
                `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`
              }
            />
            <DetailRow
              label={t('complaint.reportedOn')}
              value={new Date(complaint.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
          </View>

          {/* Status Timeline */}
          <View className="bg-gray-50 rounded-2xl px-4 py-3">
            <StatusTimeline currentStatus={complaint.status} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
