import { useState, useCallback } from 'react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.7;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UseImageCompressorReturn {
  compressImage: (uri: string) => Promise<string>;
  isCompressing: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook for compressing images before upload.
 * Resizes to a max of 1200×1200 (maintaining aspect ratio)
 * and compresses to JPEG at 0.7 quality.
 */
export function useImageCompressor(): UseImageCompressorReturn {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = useCallback(async (uri: string): Promise<string> => {
    setIsCompressing(true);
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: MAX_DIMENSION, height: MAX_DIMENSION } }],
        { compress: JPEG_QUALITY, format: SaveFormat.JPEG },
      );
      return result.uri;
    } finally {
      setIsCompressing(false);
    }
  }, []);

  return { compressImage, isCompressing };
}
