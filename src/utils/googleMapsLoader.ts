
// Google Maps API loader utility
const API_KEY = "AIzaSyDrLZWv6slQO7ejgLTD4FliIhS3t9v7uKo";
let googleMapsPromise: Promise<void> | null = null;
let mapLoadError: string | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set callbacks
    window.initMap = () => {
      resolve();
    };
    
    script.onerror = (error) => {
      mapLoadError = "Google Maps API failed to load. Please check your internet connection and try again.";
      console.error(`Google Maps API failed to load: ${error}`);
      reject(new Error(mapLoadError));
    };
    
    // If the script loaded but callback wasn't triggered
    script.onload = () => {
      // Check if the Google Maps API loaded with errors
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
      } else {
        // Use a more helpful message based on possible API key issues
        if (document.querySelector('.gm-err-content')) {
          mapLoadError = "Google Maps API key error. The API key may be invalid, restricted, or missing proper billing setup.";
        } else {
          mapLoadError = "Google Maps failed to initialize properly. Please try again later.";
        }
        console.error(mapLoadError);
        reject(new Error(mapLoadError));
      }
    };
    
    // Append script to document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Helper function to get current position using the browser's geolocation API
export const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    // Show more verbose messages for geolocation errors
    const handlePositionError = (error: GeolocationPositionError) => {
      let errorMessage = "Unknown error occurred when trying to get your location.";
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access was denied. Please enable location services in your browser settings.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Please try again later.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please check your connection and try again.";
          break;
      }
      
      console.error(`Geolocation error: ${errorMessage} (${error.message})`);
      reject(new Error(errorMessage));
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      handlePositionError,
      options || { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Geocode an address to get its coordinates
export const geocodeAddress = async (address: string): Promise<google.maps.GeocoderResult | null> => {
  await loadGoogleMapsAPI();
  
  return new Promise((resolve, reject) => {
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    } catch (error) {
      reject(new Error(`Geocoding error: ${error}`));
    }
  });
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (
  lat: number, 
  lng: number
): Promise<google.maps.GeocoderResult> => {
  await loadGoogleMapsAPI();
  
  return new Promise((resolve, reject) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };
      
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    } catch (error) {
      reject(new Error(`Reverse geocoding error: ${error}`));
    }
  });
};

// Parse address components to extract specific details
export const parseAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[]
): {
  street_number: string;
  route: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
} => {
  const result = {
    street_number: "",
    route: "",
    locality: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  };

  addressComponents.forEach((component) => {
    const types = component.types;
    
    if (types.includes("street_number")) {
      result.street_number = component.long_name;
    } else if (types.includes("route")) {
      result.route = component.long_name;
    } else if (types.includes("sublocality_level_1") || types.includes("sublocality")) {
      result.locality = component.long_name;
    } else if (types.includes("locality")) {
      result.city = component.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      result.state = component.long_name;
    } else if (types.includes("country")) {
      result.country = component.long_name;
    } else if (types.includes("postal_code")) {
      result.postal_code = component.long_name;
    }
  });

  return result;
};

// Get the current map loading error status
export const getMapLoadError = (): string | null => {
  return mapLoadError;
};

// For backwards compatibility
export const getAddressFromCoordinates = reverseGeocode;
export const initializeMap = async (): Promise<boolean> => {
  try {
    await loadGoogleMapsAPI();
    return true;
  } catch (error) {
    console.error("Failed to initialize Google Maps:", error);
    return false;
  }
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
