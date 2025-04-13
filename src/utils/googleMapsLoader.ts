
/**
 * Extend the Window interface to include our callback function
 */
declare global {
  interface Window {
    initGoogleMapsCallback: () => void;
    googleMapsInitialized: boolean;
  }
}

// Flag to track if Google Maps is already being loaded
let isLoadingMapsApi = false;

/**
 * Utility function to load the Google Maps API with the provided API key
 */
export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the API is already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");
      window.googleMapsInitialized = true;
      resolve();
      return;
    }

    // Check if API is already being loaded
    if (isLoadingMapsApi) {
      console.log("Google Maps API is already being loaded");
      // Wait for the initialization callback
      const checkInterval = setInterval(() => {
        if (window.googleMapsInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);
      return;
    }

    isLoadingMapsApi = true;

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    
    // Setup callback for when API is loaded
    window.initGoogleMapsCallback = () => {
      console.log("Google Maps API loaded successfully");
      window.googleMapsInitialized = true;
      isLoadingMapsApi = false;
      resolve();
    };
    
    // Handle errors
    script.onerror = () => {
      console.error("Error loading Google Maps API");
      isLoadingMapsApi = false;
      reject(new Error("Failed to load Google Maps API"));
    };
    
    // Add the script to the document
    document.head.appendChild(script);
  });
};

// Update API key - if you want to use a custom key, update this value
// For Lovable demo purposes, we're sticking with the sample key
export const GOOGLE_MAPS_API_KEY = "AIzaSyAZeMByxk5MMF_oSSz49bsS2IFLsO0K4B0";

// Function to initialize Google Maps and handle errors gracefully
export const initializeGoogleMaps = async (): Promise<boolean> => {
  try {
    console.log("Initializing Google Maps with API key:", GOOGLE_MAPS_API_KEY);
    await loadGoogleMapsApi(GOOGLE_MAPS_API_KEY);
    return true;
  } catch (error) {
    console.error("Failed to initialize Google Maps:", error);
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
