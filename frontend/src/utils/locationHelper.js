// src/utils/locationHelper.js

/**
 * Step 1: Location Resolution Strategy
 * Determines latitude (lat) and longitude (lng) based on logged-in address or browser GPS.
 * Returns { lat, lng } or null.
 */
export const getUserLocationCoordinates = async (isLoggedIn = false, defaultSavedAddress = null) => {
  // 1. Logged-in user: Use their default saved delivery address coordinates
  if (isLoggedIn && defaultSavedAddress?.location?.coordinates) {
    const [longitude, latitude] = defaultSavedAddress.location.coordinates;
    if (latitude !== undefined && longitude !== undefined) {
      return { lat: Number(latitude), lng: Number(longitude) };
    }
  }

  if (isLoggedIn && defaultSavedAddress?.lat && defaultSavedAddress?.lng) {
    return { lat: Number(defaultSavedAddress.lat), lng: Number(defaultSavedAddress.lng) };
  }

  // 2. Guest user or no address: Try Browser GPS Geolocation
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
          console.warn("GPS Permission Denied / Error:", error.message);
          resolve(null); // Fallback to null (show all outlets)
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }

  return null;
};
