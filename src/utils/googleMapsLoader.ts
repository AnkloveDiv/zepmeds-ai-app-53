
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
 * Utility function to load the Leaflet and Geoapify APIs
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
      
      // Now load Geoapify marker plugin
      const geoapifyMarkerScript = document.createElement("script");
      geoapifyMarkerScript.src = "https://cdn.jsdelivr.net/npm/@geoapify/leaflet-address-search-plugin@1.0.0/dist/L.Control.GeoapifyAddressSearch.min.js";
      
      const geoapifyMarkerCss = document.createElement("link");
      geoapifyMarkerCss.rel = "stylesheet";
      geoapifyMarkerCss.href = "https://cdn.jsdelivr.net/npm/@geoapify/leaflet-address-search-plugin@1.0.0/dist/L.Control.GeoapifyAddressSearch.min.css";
      
      document.head.appendChild(geoapifyMarkerCss);
      
      geoapifyMarkerScript.onload = () => {
        console.log("Geoapify Address Search plugin loaded successfully");
        window.initMapCallback();
      };
      
      geoapifyMarkerScript.onerror = () => {
        console.error("Error loading Geoapify Address Search plugin");
        isLoadingMapApi = false;
        reject(new Error("Failed to load Geoapify Address Search plugin"));
      };
      
      document.head.appendChild(geoapifyMarkerScript);
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
    // Using Geoapify Reverse Geocoding API
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geoapify API request failed');
    }
    
    const data = await response.json();
    
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
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geoapify geocode API request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const coordinates = result.geometry.coordinates;
      const lng = coordinates[0];
      const lat = coordinates[1];
      
      return {
        lat,
        lng,
        address: await getAddressFromCoordinates(lat, lng)
      };
    }
    
    // Return default location if no results
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
