
/**
 * Extend the Window interface to include our callback function
 */
declare global {
  interface Window {
    initMapplsCallback: () => void;
    mapplsInitialized: boolean;
    mappls?: any;
  }
}

// Flag to track if Mappls API is already being loaded
let isLoadingMapplsApi = false;

/**
 * Utility function to load the Mappls API with the provided API key
 */
export const loadMapplsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the API is already loaded
    if (window.mappls) {
      console.log("Mappls API already loaded");
      window.mapplsInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapplsApi) {
      console.log("Mappls API is already being loaded");
      // Wait for the initialization callback
      const checkInterval = setInterval(() => {
        if (window.mapplsInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);
      return;
    }

    isLoadingMapplsApi = true;

    // Create script element
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/7ae3a6629a15b43aea0bb0637c3c11c4/map_sdk?v=3.0&callback=initMapplsCallback`;
    script.async = true;
    script.defer = true;
    
    // Setup callback for when API is loaded
    window.initMapplsCallback = () => {
      console.log("Mappls API loaded successfully");
      window.mapplsInitialized = true;
      isLoadingMapplsApi = false;
      resolve();
    };
    
    // Handle errors
    script.onerror = () => {
      console.error("Error loading Mappls API");
      isLoadingMapplsApi = false;
      reject(new Error("Failed to load Mappls API"));
    };
    
    // Add the script to the document
    document.head.appendChild(script);
  });
};

// Mappls API credentials
export const MAPPLS_REST_API_KEY = "7ae3a6629a15b43aea0bb0637c3c11c4";
export const MAPPLS_CLIENT_ID = "96dHZVzsAuv1fooipEVKCzK_l53mX3vCcACkKACkbuKnn6F0POOSkFVB7jrAWdwYP1PhLVXdcWg6JbyK82v_sA==";
export const MAPPLS_CLIENT_SECRET = "lrFxI-iSEg88SsZgUVOl7iFmBg87-vi2d388Q8XB_ogX4uwcZwHwSUA8wOYTrMCppAJAeBQqnNRK5UEQAb3cONGxYOowWM2_";

// Function to initialize Mappls Maps and handle errors gracefully
export const initializeMapplsMaps = async (): Promise<boolean> => {
  try {
    console.log("Initializing Mappls Maps");
    await loadMapplsApi();
    return true;
  } catch (error) {
    console.error("Failed to initialize Mappls Maps:", error);
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

// Helper function to get address from Mappls reverse geocoding API
export const getAddressFromMapplsCoordinates = async (lat: number, lng: number) => {
  try {
    // Using the RESTful API for reverse geocoding
    const response = await fetch(
      `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/rev_geocode?lat=${lat}&lng=${lng}`
    );
    
    if (!response.ok) {
      throw new Error('Mappls API request failed');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      
      return {
        formatted_address: result.formatted_address,
        address_components: [
          { long_name: result.subLocality || "", short_name: result.subLocality || "", types: ["sublocality"] },
          { long_name: result.locality || "Gurugram", short_name: result.locality || "Gurugram", types: ["locality"] },
          { long_name: result.state || "Haryana", short_name: result.state || "HR", types: ["administrative_area_level_1"] },
          { long_name: "India", short_name: "IN", types: ["country"] },
          { long_name: result.pincode || "122001", short_name: result.pincode || "122001", types: ["postal_code"] }
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
    console.error("Error getting address from Mappls:", error);
    return mockGeocodeResponse(lat, lng);
  }
};

// Helper function to search for an address using Mappls API
export const searchAddressWithMappls = async (searchQuery: string) => {
  try {
    const response = await fetch(
      `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/geocode?address=${encodeURIComponent(searchQuery)}`
    );
    
    if (!response.ok) {
      throw new Error('Mappls geocode API request failed');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const lat = result.latitude;
      const lng = result.longitude;
      
      return {
        lat,
        lng,
        address: await getAddressFromMapplsCoordinates(lat, lng)
      };
    }
    
    // Return default location if no results
    return {
      lat: 28.6139,
      lng: 77.2090,
      address: mockGeocodeResponse(28.6139, 77.2090)
    };
  } catch (error) {
    console.error("Error searching with Mappls:", error);
    return {
      lat: 28.6139,
      lng: 77.2090,
      address: mockGeocodeResponse(28.6139, 77.2090)
    };
  }
};
