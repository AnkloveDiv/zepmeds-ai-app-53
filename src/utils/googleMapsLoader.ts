
// This file is now a wrapper for openLayersLoader to maintain backwards compatibility
import { 
  initializeMap,
  getCurrentPosition,
  reverseGeocode,
  geocodeAddress,
  parseAddressComponents,
  getMapLoadError,
  getCoordinatesFromClick,
  type Location
} from './openLayersLoader';

// For backwards compatibility with existing code
export const loadGoogleMapsAPI = async (): Promise<void> => {
  // This is just a stub for compatibility with existing code
  console.log("Using OpenLayers API instead of Google Maps");
  return Promise.resolve();
};

export const getAddressFromCoordinates = reverseGeocode;

// Export all required functions from openLayersLoader
export {
  initializeMap,
  getCurrentPosition,
  reverseGeocode,
  geocodeAddress,
  parseAddressComponents,
  getMapLoadError,
  getCoordinatesFromClick
};

// Re-export the Location type properly with 'export type'
export type { Location };
