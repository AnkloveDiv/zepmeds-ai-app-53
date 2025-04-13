
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

// Google Maps API key - use a valid key
export const GOOGLE_MAPS_API_KEY = "AIzaSyADOqUIGJr3iPE3fNmKJ1JVc-D2orHZi8k";

/**
 * Utility function to load the Google Maps API
 */
export const loadMapApis = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the APIs are already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps already loaded");
      window.mapInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapApi) {
      console.log("Google Maps API is already being loaded");
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

    // Setup callback for when Google Maps API is loaded
    window.initMapCallback = () => {
      console.log("Google Maps API loaded successfully");
      window.mapInitialized = true;
      isLoadingMapApi = false;
      resolve();
    };
    
    // Create script element for Google Maps
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMapCallback`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    
    // Handle loading errors
    googleMapsScript.onerror = () => {
      console.error("Error loading Google Maps API");
      isLoadingMapApi = false;
      reject(new Error("Failed to load Google Maps API"));
    };
    
    // Start loading Google Maps
    document.head.appendChild(googleMapsScript);
  });
};

// Function to initialize map libraries and handle errors gracefully
export const initializeMap = async (): Promise<boolean> => {
  try {
    console.log("Initializing Google Maps API");
    await loadMapApis();
    return true;
  } catch (error) {
    console.error("Failed to initialize Google Maps API:", error);
    return false;
  }
};

/**
 * Get current position with maximum possible accuracy
 * This function uses a more aggressive approach to get accurate location data
 */
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
    
    // First check if we have permission
    try {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then(permissionStatus => {
          if (permissionStatus.state === 'denied') {
            reject(new Error("Geolocation permission denied"));
            return;
          }
          
          // If permission is granted or prompt, try to get location
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log("Received raw position:", position.coords.latitude, position.coords.longitude, 
                        "Accuracy:", position.coords.accuracy, "meters");
              
              // If accuracy is extremely poor (> 10km), log additional info
              if (position.coords.accuracy > 10000) {
                console.warn("Extremely poor location accuracy. Device may not have GPS enabled or is indoors.");
                
                // Check if we have a timestamp to gauge freshness
                if (position.timestamp) {
                  const ageInSeconds = (Date.now() - position.timestamp) / 1000;
                  console.warn(`Position data is ${ageInSeconds.toFixed(1)} seconds old`);
                }
              }
              
              resolve(position);
            },
            error => {
              console.error("Geolocation error code:", error.code, "Message:", error.message);
              
              // Provide more detailed error message based on error code
              if (error.code === 1) {
                console.error("User denied geolocation prompt");
              } else if (error.code === 2) {
                console.error("Position unavailable. Device may have no GPS or poor signal.");
              } else if (error.code === 3) {
                console.error("Geolocation timed out. Try increasing timeout value.");
              }
              
              reject(error);
            },
            enhancedOptions
          );
        })
        .catch(error => {
          console.warn("Permission check failed, falling back to direct geolocation request:", error);
          // Still try to get location even if permission check fails
          navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            enhancedOptions
          );
        });
    } catch (error) {
      console.warn("Permission API not supported, falling back to direct geolocation request");
      // Fall back to direct geolocation request
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        enhancedOptions
      );
    }
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
