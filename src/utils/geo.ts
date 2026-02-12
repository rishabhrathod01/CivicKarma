// ─── Geo Utility Functions ───────────────────────────────────────────────────

const EARTH_RADIUS_METERS = 6_371_000;

/** Convert degrees to radians. */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate the great-circle distance between two points using the
 * Haversine formula.
 * @returns Distance in metres.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Check whether two coordinates are within a given radius.
 * @param radiusMeters – Maximum allowed distance in metres.
 */
export function isWithinRadius(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radiusMeters: number,
): boolean {
  return calculateDistance(lat1, lng1, lat2, lng2) <= radiusMeters;
}

/**
 * Format coordinates into a human-readable string.
 * @example formatCoordinates(12.9716, 77.5946) → "12.9716°N, 77.5946°E"
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

/**
 * Rough bounding-box check for whether coordinates fall within the
 * greater Bangalore region.
 *
 * Bounding box:
 *   Latitude  : 12.7 – 13.2
 *   Longitude : 77.3 – 77.8
 */
export function isInBangalore(lat: number, lng: number): boolean {
  return lat >= 12.7 && lat <= 13.2 && lng >= 77.3 && lng <= 77.8;
}
