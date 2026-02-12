// ─── Application-wide Configuration ──────────────────────────────────────────

export const APP_CONFIG = {
  /** Maximum number of reports a single user can file per day. */
  MAX_REPORTS_PER_DAY: 5,

  /** Radius in meters to flag potential duplicate reports. */
  DUPLICATE_RADIUS_METERS: 50,

  /** Time window in hours to consider for duplicate detection. */
  DUPLICATE_HOURS: 2,

  /** Maximum photos allowed per report submission. */
  MAX_PHOTOS_PER_REPORT: 5,

  /** Maximum image file size in megabytes before compression. */
  MAX_IMAGE_SIZE_MB: 2,

  /** JPEG quality (0–1) used when compressing picked images. */
  IMAGE_QUALITY: 0.7,

  /** Maximum image width in pixels after resize. */
  IMAGE_MAX_WIDTH: 1200,

  /** Maximum image height in pixels after resize. */
  IMAGE_MAX_HEIGHT: 1200,

  /** Default UI language code. */
  DEFAULT_LANGUAGE: 'en' as const,

  /** All supported language codes. */
  SUPPORTED_LANGUAGES: ['en', 'kn'] as const,

  /** Geographic centre of Bangalore (used as default map position). */
  BANGALORE_CENTER: {
    latitude: 12.9716,
    longitude: 77.5946,
  },

  /** Default zoom level when rendering the map. */
  DEFAULT_MAP_ZOOM: 12,
} as const;

// Derived types for convenience
export type SupportedLanguage = (typeof APP_CONFIG.SUPPORTED_LANGUAGES)[number];
