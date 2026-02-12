import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCamera } from '../../src/hooks/useCamera';
import { useLocation } from '../../src/hooks/useLocation';
import { useReportStore } from '../../src/stores/report.store';
import { APP_CONFIG } from '../../src/constants/config';

// ─── Photo Grid ─────────────────────────────────────────────────────────────

function PhotoGrid({
  photos,
  onAdd,
  onRemove,
  maxPhotos,
}: {
  photos: string[];
  onAdd: () => void;
  onRemove: (uri: string) => void;
  maxPhotos: number;
}) {
  const { t } = useTranslation();

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {t('report.addPhotos')} ({photos.length}/{maxPhotos})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {photos.map((uri) => (
          <View key={uri} className="relative">
            <Image
              source={{ uri }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 items-center justify-center"
              onPress={() => onRemove(uri)}
            >
              <Ionicons name="close" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ))}

        {photos.length < maxPhotos && (
          <TouchableOpacity
            onPress={onAdd}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
            <Text className="text-[10px] text-gray-400 mt-1">
              {t('report.addPhotos')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Location Preview ───────────────────────────────────────────────────────

function LocationPreview({
  address,
  isLoading,
  error,
  onRetry,
}: {
  address: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <View className="flex-row items-center mb-2">
        <Ionicons name="location" size={18} color="#1a7f37" />
        <Text className="text-sm font-medium text-gray-700 ml-2">
          {t('report.location')}
        </Text>
      </View>

      {isLoading && (
        <Text className="text-sm text-gray-400">{t('common.loading')}</Text>
      )}

      {error && (
        <View>
          <Text className="text-sm text-red-500 mb-2">{error}</Text>
          <TouchableOpacity onPress={onRetry}>
            <Text className="text-sm text-emerald-600 font-medium">
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {address && !isLoading && !error && (
        <View>
          <Text className="text-sm text-gray-600">{address}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
            <Text className="text-xs text-green-600 ml-1">
              {t('report.locationDetected')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Details Screen ─────────────────────────────────────────────────────────

export default function DetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pickFromCamera, pickFromLibrary } = useCamera();
  const {
    location,
    address,
    isLoading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation();

  const { draft, setDescription, addPhoto, removePhoto, setLocation } =
    useReportStore();

  // Auto-capture location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Sync location to report store when it changes
  useEffect(() => {
    if (location) {
      setLocation(location.latitude, location.longitude, address);
    }
  }, [location, address, setLocation]);

  const handleAddPhoto = () => {
    Alert.alert(t('report.addPhotos'), '', [
      {
        text: t('report.takePhoto'),
        onPress: async () => {
          const uri = await pickFromCamera();
          if (uri) addPhoto(uri);
        },
      },
      {
        text: t('report.chooseFromLibrary'),
        onPress: async () => {
          const uri = await pickFromLibrary();
          if (uri) addPhoto(uri);
        },
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const canProceed =
    draft.description.trim().length > 0 &&
    draft.photos.length > 0 &&
    draft.latitude !== 0;

  const handleNext = () => {
    if (draft.photos.length === 0) {
      Alert.alert(t('common.error'), t('report.photoRequired'));
      return;
    }
    router.push('/report/review');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photos */}
        <View className="mb-6">
          <PhotoGrid
            photos={draft.photos}
            onAdd={handleAddPhoto}
            onRemove={removePhoto}
            maxPhotos={APP_CONFIG.MAX_PHOTOS_PER_REPORT}
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            {t('report.description')}
          </Text>
          <TextInput
            className="border border-gray-200 rounded-xl p-4 text-base text-gray-900 bg-gray-50 min-h-[120px]"
            placeholder={t('report.descriptionPlaceholder')}
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={draft.description}
            onChangeText={setDescription}
          />
        </View>

        {/* Location */}
        <LocationPreview
          address={address}
          isLoading={locationLoading}
          error={locationError}
          onRetry={requestLocation}
        />
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${
            canProceed ? 'bg-emerald-600' : 'bg-gray-200'
          }`}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text
            className={`font-semibold text-base ${
              canProceed ? 'text-white' : 'text-gray-400'
            }`}
          >
            {t('common.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
