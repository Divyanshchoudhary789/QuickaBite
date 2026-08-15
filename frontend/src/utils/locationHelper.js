// src/utils/locationHelper.js

// Default fallback coordinates if browser GPS is denied/unavailable
export const DEFAULT_FALLBACK_COORDINATES = { lat: 26.9124, lng: 75.7873 };

/**
 * Location Resolution Strategy:
 * Sends coordinates to backend in BOTH cases (Logged-in or Not Logged-in/Guest).
 *
 * Returns { lat, lng, isApproximate, accuracy, source }
 */
export const getUserLocationCoordinates = async (isLoggedIn = false, defaultSavedAddress = null) => {
  // 1. Logged-in user: Use their default saved delivery address coordinates if available
  if (isLoggedIn && defaultSavedAddress?.location?.coordinates) {
    const [longitude, latitude] = defaultSavedAddress.location.coordinates;
    if (latitude !== undefined && longitude !== undefined) {
      return {
        lat: Number(latitude),
        lng: Number(longitude),
        isApproximate: false,
        accuracy: 10,
        source: "saved_address",
      };
    }
  }

  if (isLoggedIn && defaultSavedAddress?.lat && defaultSavedAddress?.lng) {
    return {
      lat: Number(defaultSavedAddress.lat),
      lng: Number(defaultSavedAddress.lng),
      isApproximate: false,
      accuracy: 10,
      source: "saved_address",
    };
  }

  // 2. Guest user OR logged-in user without saved address: Use Browser GPS Geolocation
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy || 0;
          const isApprox = accuracy > 150;
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(accuracy),
            isApproximate: isApprox,
            source: "gps",
          });
        },
        (error) => {
          console.warn("GPS Geolocation Notice:", error.message, "- using fallback location coordinates");
          resolve({
            ...DEFAULT_FALLBACK_COORDINATES,
            isApproximate: true,
            accuracy: null,
            source: "fallback",
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }

  // 3. Fallback default coordinates
  return {
    ...DEFAULT_FALLBACK_COORDINATES,
    isApproximate: true,
    accuracy: null,
    source: "fallback",
  };
};

/**
 * Explicitly requests high-accuracy hardware GPS position from user device.
 * Triggers native browser location permission prompt.
 * Returns Promise<{ lat, lng, accuracy, isApproximate, isExact, source }>
 */
export const requestExactHighAccuracyGps = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return reject(new Error("Geolocation is not supported on this device/browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = position.coords.accuracy || 0;
        const isExact = accuracy <= 100;
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(accuracy),
          isApproximate: !isExact,
          isExact: isExact,
          source: "gps_high_accuracy",
        });
      },
      (error) => {
        let msg = "Failed to access high-accuracy GPS.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS signal unavailable. Please ensure your device Location / GPS toggle is turned ON.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  });
};


