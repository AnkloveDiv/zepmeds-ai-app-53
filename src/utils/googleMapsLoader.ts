
/**
 * Extend the Window interface to include our callback function
 */
declare global {
  interface Window {
    initMapCallback: () => void;
    mapInitialized: boolean;
    maplibregl?: any;
    maptilersdk?: any;
  }
}

// Flag to track if Map API is already being loaded
let isLoadingMapApi = false;

/**
 * Utility function to load the MapTiler API
 */
export const loadMapTilerApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the API is already loaded
    if (window.maptilersdk && window.maplibregl) {
      console.log("MapTiler API already loaded");
      window.mapInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapApi) {
      console.log("MapTiler API is already being loaded");
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
    const mapLibreCss = document.createElement("link");
    mapLibreCss.rel = "stylesheet";
    mapLibreCss.href = "https://cdn.maptiler.com/maplibre-gl-js/v3.3.1/maplibre-gl.css";
    
    const maptilerCss = document.createElement("link");
    maptilerCss.rel = "stylesheet";
    maptilerCss.href = "https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.css";
    
    // Add CSS to document head
    document.head.appendChild(mapLibreCss);
    document.head.appendChild(maptilerCss);
    
    // Setup callback for when API is loaded
    window.initMapCallback = () => {
      console.log("MapTiler API loaded successfully");
      
      // Initialize MapTiler SDK with API key
      if (window.maptilersdk) {
        window.maptilersdk.config.apiKey = MAPTILER_API_KEY;
        console.log("MapTiler SDK initialized with API key");
        window.mapInitialized = true;
        isLoadingMapApi = false;
        resolve();
      } else {
        console.error("MapTiler SDK not found after loading");
        isLoadingMapApi = false;
        reject(new Error("MapTiler SDK not found after loading"));
      }
    };
    
    // Create script elements 
    const mapLibreScript = document.createElement("script");
    mapLibreScript.src = "https://cdn.maptiler.com/maplibre-gl-js/v3.3.1/maplibre-gl.js";
    mapLibreScript.crossOrigin = "anonymous";
    
    const maptilerScript = document.createElement("script");
    maptilerScript.src = "https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.umd.min.js";
    maptilerScript.crossOrigin = "anonymous";
    
    // Handle loading and errors
    mapLibreScript.onload = () => {
      console.log("MapLibre GL loaded successfully");
      document.head.appendChild(maptilerScript);
    };
    
    maptilerScript.onload = () => {
      console.log("MapTiler SDK loaded successfully");
      window.initMapCallback();
    };
    
    mapLibreScript.onerror = () => {
      console.error("Error loading MapLibre GL");
      isLoadingMapApi = false;
      reject(new Error("Failed to load MapLibre GL"));
    };
    
    maptilerScript.onerror = () => {
      console.error("Error loading MapTiler SDK");
      isLoadingMapApi = false;
      reject(new Error("Failed to load MapTiler SDK"));
    };
    
    // Start loading MapLibre GL first
    document.head.appendChild(mapLibreScript);
  });
};

// MapTiler API key
export const MAPTILER_API_KEY = "64tBboIY6Afyz6MQH2jS";

// Function to initialize MapTiler and handle errors gracefully
export const initializeMap = async (): Promise<boolean> => {
  try {
    console.log("Initializing MapTiler");
    await loadMapTilerApi();
    return true;
  } catch (error) {
    console.error("Failed to initialize MapTiler:", error);
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

// Helper function to get address from coordinates using MapTiler Geocoding API
export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    // Using MapTiler Geocoding API for reverse geocoding
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('MapTiler API request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const placeType = result.place_type?.[0] || "place";
      
      // Extract address components from result
      const address_components = [];
      
      if (result.text) {
        address_components.push({ 
          long_name: result.text, 
          short_name: result.text, 
          types: [placeType] 
        });
      }
      
      // Extract locality, region, etc. from context if available
      if (result.context) {
        for (const ctx of result.context) {
          const id = ctx.id || "";
          const type = id.split('.')[0];
          address_components.push({
            long_name: ctx.text,
            short_name: ctx.text,
            types: [type]
          });
        }
      }
      
      // Extract city, state, postal code if available
      const locality = address_components.find(c => c.types.includes('place'))?.long_name || "Gurugram";
      const state = address_components.find(c => c.types.includes('region'))?.long_name || "Haryana";
      const postal = address_components.find(c => c.types.includes('postcode'))?.long_name || "122001";
      
      return {
        formatted_address: result.place_name || `${result.text}, ${locality}, ${state}`,
        address_components: [
          { long_name: result.text || "", short_name: result.text || "", types: [placeType] },
          { long_name: locality, short_name: locality, types: ["locality"] },
          { long_name: state, short_name: state, types: ["administrative_area_level_1"] },
          { long_name: "India", short_name: "IN", types: ["country"] },
          { long_name: postal, short_name: postal, types: ["postal_code"] }
        ],
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
    console.error("Error getting address from MapTiler:", error);
    return mockGeocodeResponse(lat, lng);
  }
};

// Helper function to search for an address using MapTiler Geocoding API
export const searchAddressWithMapTiler = async (searchQuery: string) => {
  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('MapTiler geocode API request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const coordinates = result.center || [77.2090, 28.6139]; // [lng, lat]
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
    console.error("Error searching with MapTiler:", error);
    return {
      lat: 28.6139,
      lng: 77.2090,
      address: mockGeocodeResponse(28.6139, 77.2090)
    };
  }
};
