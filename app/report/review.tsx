import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCreateComplaint } from '../../src/hooks/useComplaints';
import { useReportStore } from '../../src/stores/report.store';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';

// ─── Section Row ────────────────────────────────────────────────────────────

function SectionRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <View className="flex-row items-start py-3 border-b border-gray-50">
      <View className="flex-1">
        <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </Text>
        <Text className="text-sm text-gray-800">{value}</Text>
      </View>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} className="ml-3 pt-3">
          <Ionicons name="pencil-outline" size={16} color="#1a7f37" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Review Screen ──────────────────────────────────────────────────────────

export default function ReviewScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { draft, isSubmitting, setSubmitting } = useReportStore();
  const createComplaint = useCreateComplaint();

  // Find category and subcategory names
  const category = DEFAULT_CATEGORIES.find(
    (c) => c.department === draft.categoryId,
  );
  const categoryName = category?.name ?? draft.categoryId;
  const subcategoryName = draft.subcategoryId ?? '—';

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await createComplaint.mutateAsync(draft);
      router.replace({
        pathname: '/report/success',
        params: { complaintId: (result as { id: string })?.id ?? '' },
      });
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {t('report.reviewTitle')}
        </Text>
        <Text className="text-sm text-gray-500 mb-6">
          {t('report.reviewSubtitle')}
        </Text>

        {/* Photos Preview */}
        {draft.photos.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-gray-400 uppercase tracking-wider">
                {t('complaint.photos')}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="pencil-outline" size={14} color="#1a7f37" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {draft.photos.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  className="w-20 h-20 rounded-xl"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Details */}
        <View className="bg-gray-50 rounded-2xl px-4 py-1">
          <SectionRow
            label={t('complaint.category')}
            value={categoryName}
            onEdit={() => router.navigate('/report/category')}
          />
          <SectionRow
            label={t('report.selectSubcategory')}
            value={subcategoryName}
            onEdit={() => router.navigate('/report/category')}
          />
          <SectionRow
            label={t('report.description')}
            value={draft.description || '—'}
            onEdit={() => router.back()}
          />
          <SectionRow
            label={t('report.location')}
            value={draft.address || `${draft.latitude.toFixed(4)}, ${draft.longitude.toFixed(4)}`}
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${
            isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600'
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-semibold text-base ml-2">
                {t('report.submitting')}
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              {t('common.submit')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
