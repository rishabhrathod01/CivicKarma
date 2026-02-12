import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UseCameraReturn {
  pickFromCamera: () => Promise<string | null>;
  pickFromLibrary: () => Promise<string | null>;
  isLoading: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PICKER_OPTIONS: Pick<
  ImagePicker.ImagePickerOptions,
  'allowsEditing' | 'quality' | 'mediaTypes'
> = {
  allowsEditing: true,
  quality: 0.7,
  mediaTypes: ['images'],
};

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook for picking images from the camera or photo library.
 * Handles permission requests and returns the image URI.
 */
export function useCamera(): UseCameraReturn {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Launch the device camera and return the captured image URI.
   * Returns null if the user cancelled or permission was denied.
   */
  const pickFromCamera = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);

      if (result.canceled || result.assets.length === 0) {
        return null;
      }

      return result.assets[0].uri;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Open the photo library picker and return the selected image URI.
   * Returns null if the user cancelled or permission was denied.
   */
  const pickFromLibrary = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

      if (result.canceled || result.assets.length === 0) {
        return null;
      }

      return result.assets[0].uri;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { pickFromCamera, pickFromLibrary, isLoading };
}
