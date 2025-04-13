
/**
 * Extend the Window interface to include our callback function and map libraries
 */
declare global {
  interface Window {
    initMapCallback: () => void;
    mapInitialized: boolean;
    L?: any; // Leaflet
    geoapify?: any;
  }
}

// Flag to track if Map API is already being loaded
let isLoadingMapApi = false;

// Geoapify API key
export const GEOAPIFY_API_KEY = "835fe0df9146416e94c2daf974a66f6a";

/**
 * Utility function to load the Leaflet API
 */
export const loadMapApis = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the APIs are already loaded
    if (window.L) {
      console.log("Leaflet already loaded");
      window.mapInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapApi) {
      console.log("Map APIs are already being loaded");
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

    // Create CSS elements first to ensure styles are loaded before scripts
    const leafletCss = document.createElement("link");
    leafletCss.rel = "stylesheet";
    leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    leafletCss.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    leafletCss.crossOrigin = "";
    
    // Add CSS to document head
    document.head.appendChild(leafletCss);
    
    // Setup callback for when APIs are loaded
    window.initMapCallback = () => {
      console.log("Map APIs loaded successfully");
      window.mapInitialized = true;
      isLoadingMapApi = false;
      resolve();
    };
    
    // Create script elements
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletScript.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    leafletScript.crossOrigin = "";
    
    // Handle loading and errors
    leafletScript.onload = () => {
      console.log("Leaflet loaded successfully");
      window.initMapCallback();
    };
    
    leafletScript.onerror = () => {
      console.error("Error loading Leaflet");
      isLoadingMapApi = false;
      reject(new Error("Failed to load Leaflet"));
    };
    
    // Start loading Leaflet first
    document.head.appendChild(leafletScript);
  });
};

// Function to initialize map libraries and handle errors gracefully
export const initializeMap = async (): Promise<boolean> => {
  try {
    console.log("Initializing map libraries");
    await loadMapApis();
    return true;
  } catch (error) {
    console.error("Failed to initialize map libraries:", error);
    return false;
  }
};

// Get current position with enhanced accuracy
export const getCurrentPosition = (options = {}): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    // Enhanced geolocation options with maximumAge reduced and timeout increased
    const enhancedOptions = {
      enableHighAccuracy: true,
      timeout: 15000,         // Increased timeout to allow more time for accurate position
      maximumAge: 0,          // Always get fresh position
      ...options
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Got precise location:", position.coords.latitude, position.coords.longitude, 
                    "Accuracy:", position.coords.accuracy, "meters");
        resolve(position);
      },
      error => {
        console.error("Error getting precise location:", error.message, "Code:", error.code);
        reject(error);
      },
      enhancedOptions
    );
  });
};

// Mock geocoding response for demonstration when API fails
export const mockGeocodeResponse = (latitude: number, longitude: number) => {
  return {
    address_components: [
      { long_name: "Unnamed Road", short_name: "Unnamed Road", types: ["route"] },
      { long_name: "Gurugram", short_name: "Gurugram", types: ["locality"] },
      { long_name: "Haryana", short_name: "HR", types: ["administrative_area_level_1"] },
      { long_name: "India", short_name: "IN", types: ["country"] },
      { long_name: "122001", short_name: "122001", types: ["postal_code"] }
    ],
    formatted_address: "Unnamed Road, Gurugram, Haryana 122001, India",
    geometry: {
      location: {
        lat: () => latitude,
        lng: () => longitude
      }
    },
    place_id: "ChIJLbZ-NFoaDTkRQJY4FbcFcgM"
  };
};

// Helper function to get address from coordinates using Geoapify Reverse Geocoding API
export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    console.log("Getting address for coordinates:", lat, lng);
    // Using Geoapify Reverse Geocoding API with improved precision parameters
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}&format=json&lang=en&type=street&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geoapify API request failed');
    }
    
    const data = await response.json();
    console.log("Geoapify reverse geocoding response:", data);
    
    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const properties = result.properties;
      
      // Extract address components from result
      const address_components = [];
      
      // Route/street
      if (properties.street) {
        address_components.push({ 
          long_name: properties.street, 
          short_name: properties.street, 
          types: ["route"] 
        });
      }
      
      // City/locality
      if (properties.city) {
        address_components.push({
          long_name: properties.city,
          short_name: properties.city,
          types: ["locality"]
        });
      }
      
      // State/region
      if (properties.state) {
        address_components.push({
          long_name: properties.state,
          short_name: properties.state_code || properties.state,
          types: ["administrative_area_level_1"]
        });
      }
      
      // Country
      if (properties.country) {
        address_components.push({
          long_name: properties.country,
          short_name: properties.country_code,
          types: ["country"]
        });
      }
      
      // Postal code
      if (properties.postcode) {
        address_components.push({
          long_name: properties.postcode,
          short_name: properties.postcode,
          types: ["postal_code"]
        });
      }
      
      // Create formatted address
      const formatted_address = properties.formatted || 
        `${properties.street || ''}, ${properties.city || ''}, ${properties.state || ''} ${properties.postcode || ''}`;
      
      return {
        formatted_address,
        address_components,
        geometry: {
          location: {
            lat: () => lat,
            lng: () => lng
          }
        }
      };
    }
    
    // Fallback to mock data if no results
    return mockGeocodeResponse(lat, lng);
  } catch (error) {
    console.error("Error getting address from Geoapify:", error);
    return mockGeocodeResponse(lat, lng);
  }
};

// Helper function to search for an address using Geoapify Geocoding API
export const searchAddressWithGeoapify = async (searchQuery: string) => {
  try {
    console.log("Searching for location:", searchQuery);
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}&format=json&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geoapify geocode API request failed');
    }
    
    const data = await response.json();
    console.log("Geoapify geocoding response:", data);
    
    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const coordinates = result.geometry.coordinates;
      const lng = coordinates[0];
      const lat = coordinates[1];
      
      console.log("Found coordinates:", lat, lng);
      
      // Get detailed address using reverse geocoding to ensure consistency
      const addressDetails = await getAddressFromCoordinates(lat, lng);
      
      return {
        lat,
        lng,
        address: addressDetails
      };
    }
    
    // Return default location if no results
    console.warn("No locations found, using default location");
    return {
      lat: 28.6139,
      lng: 77.2090,
      address: mockGeocodeResponse(28.6139, 77.2090)
    };
  } catch (error) {
    console.error("Error searching with Geoapify:", error);
    return {
      lat: 28.6139,
      lng: 77.2090,
      address: mockGeocodeResponse(28.6139, 77.2090)
    };
  }
};
