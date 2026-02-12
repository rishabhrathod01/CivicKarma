import * as FileSystem from 'expo-file-system';

// ─── Image Utility Functions ─────────────────────────────────────────────────

/**
 * Generate a unique filename for a complaint photo.
 * @example generatePhotoFileName("abc123") → "complaint_abc123_1707753600000.jpg"
 */
export function generatePhotoFileName(complaintId: string): string {
  const timestamp = Date.now();
  return `complaint_${complaintId}_${timestamp}.jpg`;
}

/**
 * Get the approximate file size of a local image in megabytes.
 *
 * Uses `expo-file-system` to read the file info. Returns 0 if the file
 * cannot be read (best-effort approach for React Native).
 */
export async function getImageSizeInMB(uri: string): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    if (info.exists && 'size' in info && typeof info.size === 'number') {
      return info.size / (1024 * 1024);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Basic validation that a URI looks like a valid image path.
 * Checks for common image extensions or content URI / file URI patterns.
 */
export function isValidImageUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false;

  // Trim whitespace
  const trimmed = uri.trim();
  if (trimmed.length === 0) return false;

  // Accept file:// or content:// URIs (common on mobile)
  if (trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
    return true;
  }

  // Accept http(s) URIs pointing to image extensions
  if (/^https?:\/\/.+/i.test(trimmed)) {
    return /\.(jpe?g|png|gif|webp|bmp|heic)(\?.*)?$/i.test(trimmed);
  }

  // Accept bare paths ending in image extensions
  return /\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(trimmed);
}
