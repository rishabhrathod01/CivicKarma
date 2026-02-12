import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COMPLAINT_STATUS_LABELS } from '../../src/types/complaints';
import type { ComplaintStatus } from '../../src/types/complaints';

// ─── Mock Data ──────────────────────────────────────────────────────────────

interface MockComplaint {
  id: string;
  category_name: string;
  subcategory_name: string;
  department: string;
  description: string;
  status: ComplaintStatus;
  address: string;
  created_at: string;
  photo_url: string | null;
}

const MOCK_COMPLAINTS: MockComplaint[] = [
  {
    id: '1',
    category_name: 'BBMP',
    subcategory_name: 'Garbage',
    department: 'bbmp',
    description:
      'Garbage piled up at the corner of 5th Cross, Indiranagar. Not collected for 3 days.',
    status: 'submitted',
    address: '5th Cross, Indiranagar, Bangalore',
    created_at: '2025-02-10T10:30:00Z',
    photo_url: null,
  },
  {
    id: '2',
    category_name: 'Traffic',
    subcategory_name: 'Illegal Parking',
    department: 'traffic',
    description:
      'Vehicles parked on the footpath near Koramangala bus stop, blocking pedestrian access.',
    status: 'forwarded',
    address: 'Koramangala Bus Stop, Bangalore',
    created_at: '2025-02-09T14:15:00Z',
    photo_url: null,
  },
  {
    id: '3',
    category_name: 'Road & Infrastructure',
    subcategory_name: 'Potholes',
    department: 'road_infra',
    description:
      'Large pothole on Outer Ring Road near Marathahalli bridge. Dangerous for two-wheelers.',
    status: 'acknowledged',
    address: 'Outer Ring Road, Marathahalli, Bangalore',
    created_at: '2025-02-08T09:00:00Z',
    photo_url: null,
  },
  {
    id: '4',
    category_name: 'BBMP',
    subcategory_name: 'Street Lights',
    department: 'bbmp',
    description:
      'Street lights not working on MG Road for the past week. Very unsafe at night.',
    status: 'resolved',
    address: 'MG Road, Bangalore',
    created_at: '2025-02-07T18:45:00Z',
    photo_url: null,
  },
];

// ─── Filter Types ───────────────────────────────────────────────────────────

type FilterKey = 'all' | 'bbmp' | 'traffic' | 'road_infra';

interface FilterChip {
  key: FilterKey;
  labelKey: string;
}

const FILTERS: FilterChip[] = [
  { key: 'all', labelKey: 'home.filterAll' },
  { key: 'bbmp', labelKey: 'home.filterBbmp' },
  { key: 'traffic', labelKey: 'home.filterTraffic' },
  { key: 'road_infra', labelKey: 'home.filterRoad' },
];

// ─── Complaint Card ─────────────────────────────────────────────────────────

function ComplaintCard({ item }: { item: MockComplaint }) {
  const statusInfo = COMPLAINT_STATUS_LABELS[item.status];

  return (
    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="bg-emerald-50 rounded-lg px-2 py-1">
            <Text className="text-xs font-semibold text-emerald-700">
              {item.category_name}
            </Text>
          </View>
          {item.subcategory_name && (
            <Text className="text-xs text-gray-400 ml-2">
              {item.subcategory_name}
            </Text>
          )}
        </View>
        <View
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: `${statusInfo.color}20` }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.label}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-800 leading-5 mb-3" numberOfLines={2}>
        {item.description}
      </Text>

      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
        <Text className="text-xs text-gray-400 ml-1 flex-1" numberOfLines={1}>
          {item.address}
        </Text>
        <Text className="text-xs text-gray-400">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
      <Text className="text-base text-gray-400 mt-4 text-center">
        {t('home.emptyState')}
      </Text>
    </View>
  );
}

// ─── Home Screen ────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const filteredComplaints =
    activeFilter === 'all'
      ? MOCK_COMPLAINTS
      : MOCK_COMPLAINTS.filter((c) => c.department === activeFilter);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2 bg-white">
        <Text className="text-2xl font-bold text-gray-900">
          {t('common.appName')}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {t('home.subtitle')}
        </Text>
      </View>

      {/* Filter Chips */}
      <View className="bg-white pb-3 border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter.key
                  ? 'bg-emerald-600'
                  : 'bg-gray-100'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter.key
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
              >
                {t(filter.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Complaints List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7f37" />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ComplaintCard item={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1a7f37"
              colors={['#1a7f37']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
