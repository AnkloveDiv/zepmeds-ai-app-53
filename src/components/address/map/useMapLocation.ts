
import { useState, useCallback } from 'react';
import { getCurrentPosition, reverseGeocode } from '@/utils/googleMapsLoader';
import { toast } from 'sonner';

export interface Location {
  lat: number;
  lng: number;
}

export const useMapLocation = (
  map: google.maps.Map | null,
  marker: google.maps.Marker | null,
  setError: (error: string | null) => void
) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const updateMapAndMarker = useCallback((newLocation: Location) => {
    if (!map || !marker) return;
    
    const latLng = new google.maps.LatLng(newLocation.lat, newLocation.lng);
    map.setCenter(latLng);
    map.setZoom(16);
    marker.setPosition(latLng);
    setLocation(newLocation);
  }, [map, marker]);

  const getMyLocation = useCallback(async () => {
    if (!map || !marker) return;
    
    setIsGettingLocation(true);
    setError(null);
    
    try {
      const position = await getCurrentPosition();
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      updateMapAndMarker(newLocation);
      
      // Try to get address information
      try {
        await reverseGeocode(newLocation.lat, newLocation.lng);
      } catch (geocodeError) {
        console.error("Reverse geocoding error:", geocodeError);
        // We don't set an error here as we still have the coordinates
      }
    } catch (error: any) {
      console.error("Geolocation error:", error);
      
      let errorMessage = "Could not access your location.";
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location services.";
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please try again.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please try again.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  }, [map, marker, setError, updateMapAndMarker]);

  return {
    location,
    setLocation: updateMapAndMarker,
    isGettingLocation,
    getMyLocation
  };
};
