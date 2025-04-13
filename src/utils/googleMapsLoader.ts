
/**
 * Extend the Window interface to include our callback function and map libraries
 */
declare global {
  interface Window {
    initMapCallback: () => void;
    mapInitialized: boolean;
    google?: typeof google;
  }
}

// Flag to track if Map API is already being loaded
let isLoadingMapApi = false;

// Go Maps API key
export const GOOGLE_MAPS_API_KEY = "AlzaSyRIm6NDqRiYpX5qvgYaAfNDfcDOvtYqTxH";

/**
 * Utility function to load the Go Maps API
 */
export const loadMapApis = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the APIs are already loaded
    if (window.google && window.google.maps) {
      console.log("Go Maps already loaded");
      window.mapInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapApi) {
      console.log("Go Maps API is already being loaded");
      // Wait for the initialization callback
      const checkInterval = setInterval(() => {
        if (window.mapInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);
      return;
    }

    isLoadingMapApi = true;
    window.mapInitialized = false;

    // Setup callback for when Go Maps API is loaded
    window.initMapCallback = () => {
      console.log("Go Maps API loaded successfully");
      window.mapInitialized = true;
      isLoadingMapApi = false;
      resolve();
    };
    
    // Create script element for Go Maps
    const goMapsScript = document.createElement("script");
    goMapsScript.src = `https://maps.gomaps.pro/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMapCallback`;
    goMapsScript.async = true;
    goMapsScript.defer = true;
    
    // Handle loading errors
    goMapsScript.onerror = () => {
      console.error("Error loading Go Maps API");
      isLoadingMapApi = false;
      reject(new Error("Failed to load Go Maps API"));
    };
    
    // Start loading Go Maps
    document.head.appendChild(goMapsScript);
  });
};

// Function to initialize map libraries and handle errors gracefully
export const initializeMap = async (): Promise<boolean> => {
  try {
    console.log("Initializing Go Maps API");
    await loadMapApis();
    return true;
  } catch (error) {
    console.error("Failed to initialize Go Maps API:", error);
    return false;
  }
};

// Get current position with maximum possible accuracy
export const getCurrentPosition = (options = {}): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    // Maximum accuracy options
    const enhancedOptions = {
      enableHighAccuracy: true,  // Always request high accuracy
      timeout: 10000,            // 10 seconds timeout
      maximumAge: 0,             // Never use cached position
      ...options
    };

    console.log("Requesting position with options:", enhancedOptions);

    // Try to get position via the browser's Geolocation API
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Received raw position:", position.coords.latitude, position.coords.longitude, 
                  "Accuracy:", position.coords.accuracy, "meters");
        resolve(position);
      },
      error => {
        console.error("Geolocation error code:", error.code, "Message:", error.message);
        reject(error);
      },
      enhancedOptions
    );
  });
};

// Helper function to get address from coordinates using Google Maps Geocoding API
export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    console.log("Getting address for coordinates:", lat, lng);
    
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }
    
    return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            console.log("Google Geocoder response:", results);
            resolve(results[0]);
          } else {
            console.error("Geocoder failed due to:", status);
            reject(new Error(`Geocoder failed: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error getting address from Google Maps:", error);
    
    // Return generic information in case of error
    console.warn("Error fetching address, returning generic address data");
    return {
      address_components: [
        { long_name: "Unknown Location", short_name: "Unknown Location", types: ["route"] },
        { long_name: "Unknown City", short_name: "Unknown City", types: ["locality"] },
        { long_name: "Unknown State", short_name: "Unknown", types: ["administrative_area_level_1"] },
        { long_name: "Unknown Country", short_name: "Unknown", types: ["country"] },
        { long_name: "000000", short_name: "000000", types: ["postal_code"] }
      ],
      formatted_address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      geometry: {
        location: new google.maps.LatLng(lat, lng)
      },
      place_id: "unknown"
    };
  }
};

// Helper function to search for an address using Google Maps Geocoding API
export const searchAddressWithGoogle = async (searchQuery: string) => {
  try {
    console.log("Searching for location:", searchQuery);
    
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }
    
    return new Promise<{lat: number, lng: number, address: google.maps.GeocoderResult}>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode(
        { address: searchQuery },
        (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            console.log("Google Geocoder search response:", results);
            const location = results[0].geometry.location;
            
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              address: results[0]
            });
          } else {
            console.error("Geocoder search failed due to:", status);
            reject(new Error(`Geocoder search failed: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error searching with Google Maps:", error);
    throw error;
  }
};
