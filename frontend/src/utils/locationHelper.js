// src/utils/locationHelper.js

// Default fallback coordinates if browser GPS is denied/unavailable
const DEFAULT_FALLBACK_COORDINATES = { lat: 26.9124, lng: 75.7873 };

/**
 * Location Resolution Strategy:
 * Sends coordinates to backend in BOTH cases (Logged-in or Not Logged-in/Guest).
 *
 * 1. Logged-in user with saved address: Uses saved delivery address coordinates.
 * 2. Guest user or no saved address: Uses Browser GPS Geolocation.
 * 3. GPS denied/unavailable: Uses default location coordinates.
 *
 * Always returns { lat, lng } so coordinates are sent in 100% of cases.
 */
export const getUserLocationCoordinates = async (isLoggedIn = false, defaultSavedAddress = null) => {
  // 1. Logged-in user: Use their default saved delivery address coordinates if available
  if (isLoggedIn && defaultSavedAddress?.location?.coordinates) {
    const [longitude, latitude] = defaultSavedAddress.location.coordinates;
    if (latitude !== undefined && longitude !== undefined) {
      return { lat: Number(latitude), lng: Number(longitude) };
    }
  }

  if (isLoggedIn && defaultSavedAddress?.lat && defaultSavedAddress?.lng) {
    return { lat: Number(defaultSavedAddress.lat), lng: Number(defaultSavedAddress.lng) };
  }

  // 2. Guest user OR logged-in user without saved address: Use Browser GPS Geolocation
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("GPS Geolocation Notice:", error.message, "- using fallback location coordinates");
          resolve(DEFAULT_FALLBACK_COORDINATES);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }

  // 3. Fallback default coordinates
  return DEFAULT_FALLBACK_COORDINATES;
};

