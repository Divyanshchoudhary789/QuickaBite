import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  AlertCircle,
  Compass,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin as GmpPin,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

// Helper to check if API key is a demo key or placeholder
const isDemoKey = (key) => {
  if (!key) return true;
  if (key === "YOUR_API_KEY") return true;
  // Common demo key string pattern in repository
  if (key.includes("AIzaSyAD0wn2mutGTPDF1JpCWQeZKT2Zgfz44_E")) return true;
  return false;
};

function GooglePlaceAutocompleteInput({ onPlaceSelect, className }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ["geometry", "formatted_address"],
    };
    const autocomplete = new places.Autocomplete(inputRef.current, options);
    setPlaceAutocomplete(autocomplete);
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    const listener = placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        onPlaceSelect(place);
      }
    });
    return () => {
      if (listener) listener.remove();
    };
  }, [placeAutocomplete, onPlaceSelect]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for landmark, area or street..."
        className={className}
      />
      <div className="absolute left-3.5 top-3.5 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
    </div>
  );
}

export default function DeliveryLocationPicker({
  apiKey,
  initialLat = 25.0794,
  initialLng = 55.1368,
  onLocationSelect,
  triggerToast,
}) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [googleLoadError, setGoogleLoadError] = useState(false);

  // Check if we should use OpenStreetMap fallback or Google Maps
  const useGoogleMaps = Boolean(apiKey) && !isDemoKey(apiKey) && !googleLoadError;

  // Sync internal state if initial props change
  useEffect(() => {
    if (initialLat && initialLng) {
      setLat(initialLat);
      setLng(initialLng);
    }
  }, [initialLat, initialLng]);

  // Reverse Geocoding using OpenStreetMap Nominatim
  const reverseGeocodeOsm = useCallback(
    async (latitude, longitude) => {
      setIsGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch address");
        const data = await response.json();
        if (data && data.display_name) {
          setFormattedAddress(data.display_name);
          if (onLocationSelect) {
            onLocationSelect({
              lat: latitude,
              lng: longitude,
              address: data.display_name,
            });
          }
        }
      } catch (err) {
        console.warn("OSM Reverse Geocode error:", err);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationSelect]
  );

  // Reverse Geocoding using Google Geocoder with fallback
  const handleReverseGeocode = useCallback(
    (latitude, longitude) => {
      if (
        useGoogleMaps &&
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        try {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const addr = results[0].formatted_address;
                setFormattedAddress(addr);
                if (onLocationSelect) {
                  onLocationSelect({ lat: latitude, lng: longitude, address: addr });
                }
                if (triggerToast) triggerToast("Address auto-filled from map pin!");
              } else {
                reverseGeocodeOsm(latitude, longitude);
              }
            }
          );
          return;
        } catch (e) {
          console.warn("Google Geocoder error, falling back to OSM", e);
        }
      }
      // Fallback
      reverseGeocodeOsm(latitude, longitude);
      if (triggerToast) triggerToast("Address auto-filled from map pin!");
    },
    [useGoogleMaps, onLocationSelect, reverseGeocodeOsm, triggerToast]
  );

  // Trigger initial reverse geocode if address empty
  useEffect(() => {
    if (!formattedAddress && lat && lng) {
      reverseGeocodeOsm(lat, lng);
    }
  }, [lat, lng, formattedAddress, reverseGeocodeOsm]);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      if (triggerToast) triggerToast("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        handleReverseGeocode(newLat, newLng);
        setIsLocating(false);
        if (triggerToast) triggerToast("Current location detected!");
      },
      (error) => {
        setIsLocating(false);
        console.warn("Geolocation error:", error);
        if (triggerToast)
          triggerToast("Unable to fetch current location. Please select on map.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Nominatim location search for fallback mode
  const handleOsmSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data || []);
      if (data && data.length > 0) {
        const first = data[0];
        const newLat = parseFloat(first.lat);
        const newLng = parseFloat(first.lon);
        setLat(newLat);
        setLng(newLng);
        setFormattedAddress(first.display_name);
        if (onLocationSelect) {
          onLocationSelect({
            lat: newLat,
            lng: newLng,
            address: first.display_name,
          });
        }
        if (triggerToast) triggerToast("Location found and pinned!");
      } else {
        if (triggerToast) triggerToast("No locations found for your query.");
      }
    } catch (err) {
      console.error("OSM Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    setLat(newLat);
    setLng(newLng);
    setFormattedAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery("");
    if (onLocationSelect) {
      onLocationSelect({
        lat: newLat,
        lng: newLng,
        address: result.display_name,
      });
    }
    if (triggerToast) triggerToast("Location selected!");
  };

  return (
    <div className="space-y-3">
      {/* Header controls & info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-orange" />
            <span>Pin Delivery Location</span>
          </label>
          <span className="text-[10px] text-gray-400 font-medium block">
            {useGoogleMaps
              ? "Drag pin or click map to set exact delivery drop-off"
              : "Interactive OpenStreetMap • Click or drag pin to adjust coordinates"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-brand-orange border border-orange-200/80 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          {isLocating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Navigation className="h-3.5 w-3.5" />
          )}
          <span>{isLocating ? "Locating..." : "Use My Location"}</span>
        </button>
      </div>

      {/* Google Maps View */}
      {useGoogleMaps ? (
        <div className="space-y-3">
          <APIProvider apiKey={apiKey} libraries={["places", "geocoding"]}>
            <GooglePlaceAutocompleteInput
              onPlaceSelect={(place) => {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                setLat(newLat);
                setLng(newLng);
                if (place.formatted_address) {
                  setFormattedAddress(place.formatted_address);
                  if (onLocationSelect) {
                    onLocationSelect({
                      lat: newLat,
                      lng: newLng,
                      address: place.formatted_address,
                    });
                  }
                }
                if (triggerToast) triggerToast("Location found and pinned!");
              }}
              className="w-full text-xs p-3.5 pl-10 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange shadow-xs"
            />
            <div
              className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm relative"
              style={{ height: "320px", width: "100%" }}
            >
              <Map
                defaultCenter={{ lat, lng }}
                center={{ lat, lng }}
                defaultZoom={15}
                mapId="globaleats_delivery_picker"
                style={{ height: "100%", width: "100%" }}
                onClick={(e) => {
                  if (e.detail.latLng) {
                    const newLat = e.detail.latLng.lat;
                    const newLng = e.detail.latLng.lng;
                    setLat(newLat);
                    setLng(newLng);
                    handleReverseGeocode(newLat, newLng);
                  }
                }}
              >
                <AdvancedMarker
                  position={{ lat, lng }}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      const newLat = e.latLng.lat();
                      const newLng = e.latLng.lng();
                      setLat(newLat);
                      setLng(newLng);
                      handleReverseGeocode(newLat, newLng);
                    }
                  }}
                >
                  <GmpPin
                    background={"#F97316"}
                    glyphColor={"#FFF"}
                    borderColor={"#C2410C"}
                  />
                </AdvancedMarker>
              </Map>
            </div>
          </APIProvider>
        </div>
      ) : (
        /* OpenStreetMap Interactive Fallback View */
        <div className="space-y-2">
          {/* Search box for OSM Mode */}
          <form onSubmit={handleOsmSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or street..."
              className="w-full text-xs p-3.5 pl-10 pr-20 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange shadow-xs"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-3 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              {isSearching ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </form>

          {/* Search dropdown results */}
          {searchResults.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100 z-20 relative">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-brand-orange flex items-center gap-2 transition"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Real OpenStreetMap Live Tile Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-md flex flex-col justify-between" style={{ height: "320px" }}>
            {/* Live OpenStreetMap Iframe Canvas */}
            <iframe
              title="OpenStreetMap Location Picker"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.005}%2C${lng + 0.008}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
              className="w-full h-full opacity-90 transition-opacity duration-300"
            />

            {/* Click-to-Pin Overlay Handler */}
            <div
              className="absolute inset-0 cursor-crosshair z-10"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                // Calculate position relative to container center
                const deltaX = (x / rect.width - 0.5) * 0.016;
                const deltaY = (0.5 - y / rect.height) * 0.01;
                const newLat = lat + deltaY;
                const newLng = lng + deltaX;
                setLat(newLat);
                setLng(newLng);
                handleReverseGeocode(newLat, newLng);
              }}
            />

            {/* Pulsing Pin Overlay at Map Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
              <span className="absolute bottom-0 h-4 w-4 rounded-full bg-brand-orange opacity-75 animate-ping" />
              <span className="absolute bottom-0 h-2 w-2 rounded-full bg-brand-orange" />
              <div className="bg-brand-orange text-white p-2.5 rounded-full shadow-2xl border-2 border-white animate-bounce">
                <MapPin className="h-6 w-6" />
              </div>
            </div>

            {/* Demo API Key info badge */}
            <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex justify-between items-start gap-2">
              <div className="bg-neutral-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-[10px] text-neutral-300 flex items-center gap-1.5 shadow-lg">
                <Compass className="h-3.5 w-3.5 text-brand-orange" />
                <span>OpenStreetMap Interactive Engine Active</span>
              </div>
            </div>

            {/* Click instruction bar */}
            <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none bg-neutral-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-300 font-medium">
                📍 Click anywhere on the map to place your delivery pin
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lat / Lng & Status Footer Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-gray-200/80 p-2.5 rounded-xl text-[11px] text-gray-600 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 font-sans">Coordinates:</span>
          <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-800">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        </div>
        {isGeocoding && (
          <span className="flex items-center gap-1 text-brand-orange font-sans font-medium text-[10px]">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Fetching address...</span>
          </span>
        )}
      </div>
    </div>
  );
}
