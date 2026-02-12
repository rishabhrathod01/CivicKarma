import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface UseLocationReturn {
  location: Coordinates | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook for getting the user's current GPS location.
 * Handles permission requests and optional reverse geocoding.
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request foreground permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError(
          'Location permission denied. Please enable location access in your device settings.',
        );
        return;
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation(coords);

      // Attempt reverse geocode for a human-readable address
      try {
        const [geocoded] = await Location.reverseGeocodeAsync(coords);
        if (geocoded) {
          const parts = [
            geocoded.name,
            geocoded.street,
            geocoded.district,
            geocoded.city,
            geocoded.region,
            geocoded.postalCode,
          ].filter(Boolean);

          setAddress(parts.join(', '));
        }
      } catch {
        // Reverse geocoding is best-effort; location is still usable
        setAddress(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { location, address, isLoading, error, requestLocation };
}
