
/**
 * Utility function to load the Google Maps API with the provided API key
 */
export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the API is already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    
    // Setup callback for when API is loaded
    window.initGoogleMapsCallback = () => {
      console.log("Google Maps API loaded successfully");
      resolve();
    };
    
    // Handle errors
    script.onerror = () => {
      console.error("Error loading Google Maps API");
      reject(new Error("Failed to load Google Maps API"));
    };
    
    // Add the script to the document
    document.head.appendChild(script);
  });
};

// Specify Google Maps API key - normally this would be in an env file
export const GOOGLE_MAPS_API_KEY = "AIzaSyAZeMByxk5MMF_oSSz49bsS2IFLsO0K4B0";

// Function to initialize Google Maps in a specific component when needed
export const initializeGoogleMaps = async (): Promise<void> => {
  try {
    await loadGoogleMapsApi(GOOGLE_MAPS_API_KEY);
  } catch (error) {
    console.error("Failed to initialize Google Maps:", error);
  }
};
