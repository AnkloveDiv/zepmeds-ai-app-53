
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { toast } from 'sonner';

// Create a singleton for the map to avoid multiple initializations
let mapInstance: Map | null = null;
let markerSource: VectorSource | null = null;
let markerLayer: VectorLayer<VectorSource> | null = null;
let mapLoadError: string | null = null;

export interface Location {
  lat: number;
  lng: number;
}

/**
 * Initialize the OpenLayers map
 */
export const initializeMap = (
  targetElement: HTMLElement,
  initialCenter: Location = { lat: 20.5937, lng: 78.9629 },
  zoom: number = 5
): Map => {
  if (mapInstance) {
    // If map already exists, just re-assign it to the new target
    mapInstance.setTarget(targetElement);
    return mapInstance;
  }

  try {
    // Create marker source and layer
    markerSource = new VectorSource();
    markerLayer = new VectorLayer({
      source: markerSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23DC4C3E&icon=fa-map-marker&color=%23FFFFFF',
          scale: 0.7
        })
      })
    });

    // Create map
    const map = new Map({
      target: targetElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        markerLayer
      ],
      view: new View({
        center: fromLonLat([initialCenter.lng, initialCenter.lat]),
        zoom: zoom
      })
    });

    mapInstance = map;
    return map;
  } catch (error) {
    console.error('Error initializing OpenLayers map:', error);
    mapLoadError = 'Failed to initialize map. Please check your internet connection.';
    throw new Error(mapLoadError);
  }
};

/**
 * Set marker on the map
 */
export const setMapMarker = (location: Location): void => {
  if (!mapInstance || !markerSource) return;

  // Clear existing markers
  markerSource.clear();

  // Create a new marker
  const marker = new Feature({
    geometry: new Point(fromLonLat([location.lng, location.lat]))
  });

  // Add the marker to the source
  markerSource.addFeature(marker);

  // Center the map on the marker
  mapInstance.getView().setCenter(fromLonLat([location.lng, location.lat]));
  mapInstance.getView().setZoom(16);
};

/**
 * Get the user's current location using the Geolocation API
 */
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

/**
 * Reverse geocode coordinates to get address information
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<any> => {
  try {
    // Use Nominatim OpenStreetMap service for geocoding (free and doesn't require API key)
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AddressSelector App'  // Required by Nominatim usage policy
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.status}`);
    }

    const data = await response.json();
    return {
      address_components: createAddressComponentsFromNominatim(data.address),
      formatted_address: data.display_name,
      geometry: {
        location: {
          lat: () => lat,
          lng: () => lng
        }
      }
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw new Error('Failed to get address from coordinates');
  }
};

/**
 * Forward geocode an address to get coordinates
 */
export const geocodeAddress = async (address: string): Promise<any> => {
  try {
    // Use Nominatim OpenStreetMap service for geocoding (free and doesn't require API key)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AddressSelector App'  // Required by Nominatim usage policy
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to geocode address: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new Error('No results found for this address');
    }

    const result = data[0];
    return {
      place_id: result.place_id,
      formatted_address: result.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(result.lat),
          lng: () => parseFloat(result.lon)
        }
      }
    };
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw error;
  }
};

/**
 * Convert Nominatim address format to Google-like address components
 */
function createAddressComponentsFromNominatim(address: any): any[] {
  const components = [];

  // Street number
  if (address.house_number) {
    components.push({
      long_name: address.house_number,
      short_name: address.house_number,
      types: ['street_number']
    });
  }

  // Street name
  if (address.road) {
    components.push({
      long_name: address.road,
      short_name: address.road,
      types: ['route']
    });
  }

  // Locality/Neighborhood
  if (address.suburb || address.neighbourhood) {
    components.push({
      long_name: address.suburb || address.neighbourhood,
      short_name: address.suburb || address.neighbourhood,
      types: ['sublocality', 'sublocality_level_1']
    });
  }

  // City
  if (address.city || address.town || address.village) {
    components.push({
      long_name: address.city || address.town || address.village,
      short_name: address.city || address.town || address.village,
      types: ['locality']
    });
  }

  // State
  if (address.state) {
    components.push({
      long_name: address.state,
      short_name: address.state,
      types: ['administrative_area_level_1']
    });
  }

  // Country
  if (address.country) {
    components.push({
      long_name: address.country,
      short_name: address.country_code?.toUpperCase() || address.country,
      types: ['country']
    });
  }

  // Postal code
  if (address.postcode) {
    components.push({
      long_name: address.postcode,
      short_name: address.postcode,
      types: ['postal_code']
    });
  }

  return components;
}

/**
 * Parse address components (similar to Google Maps format)
 */
export const parseAddressComponents = (
  addressComponents: any[]
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

/**
 * Check if map has an error
 */
export const getMapLoadError = (): string | null => {
  return mapLoadError;
};

/**
 * Get coordinates from a map click
 */
export const getCoordinatesFromClick = (map: Map, event: any): Location => {
  const coordinates = map.getEventCoordinate(event.originalEvent);
  const lonLat = toLonLat(coordinates);
  return {
    lng: lonLat[0],
    lat: lonLat[1]
  };
};

// For backwards compatibility with existing code
export const loadGoogleMapsAPI = async (): Promise<void> => {
  // This is just a stub for compatibility
  return Promise.resolve();
};

export const getAddressFromCoordinates = reverseGeocode;
