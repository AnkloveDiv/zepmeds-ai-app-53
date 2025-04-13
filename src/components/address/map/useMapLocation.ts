
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
    if (!map || !marker) {
      setError("Map is not ready yet. Please try again in a moment.");
      return;
    }
    
    setIsGettingLocation(true);
    setError(null);
    
    try {
      // Show toast to indicate we're getting location
      toast.info("Getting your location...");
      
      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
      
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      updateMapAndMarker(newLocation);
      toast.success("Location found!");
      
      // Try to get address information
      try {
        await reverseGeocode(newLocation.lat, newLocation.lng);
      } catch (geocodeError) {
        console.error("Reverse geocoding error:", geocodeError);
        toast.warning("Found your location, but couldn't get address details. Please fill in manually.");
        // We don't set an error here as we still have the coordinates
      }
    } catch (error: any) {
      console.error("Geolocation error:", error);
      
      let errorMessage = "Could not access your location.";
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location services in your browser settings and try again.";
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please try again or enter your address manually.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please check your connection and try again.";
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
