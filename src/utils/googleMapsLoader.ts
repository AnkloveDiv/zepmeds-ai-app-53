
// Google Maps API loader utility
const API_KEY = "AIzaSyDrLZWv6slQO7ejgLTD4FliIhS3t9v7uKo";
let googleMapsPromise: Promise<void> | null = null;

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
      reject(new Error(`Google Maps API failed to load: ${error}`));
    };
    
    // Append script to document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Helper function to get current position using the browser's geolocation API
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Geocode an address to get its coordinates
export const geocodeAddress = async (address: string): Promise<google.maps.GeocoderResult | null> => {
  await loadGoogleMapsAPI();
  
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        resolve(results[0]);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (
  lat: number, 
  lng: number
): Promise<google.maps.GeocoderResult | null> => {
  await loadGoogleMapsAPI();
  
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        resolve(results[0]);
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
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

declare global {
  interface Window {
    initMap: () => void;
  }
}
