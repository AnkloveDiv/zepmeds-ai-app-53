
import { useState, useCallback } from 'react';
import { getCurrentPosition, reverseGeocode, setMapMarker } from '@/utils/openLayersLoader';
import { Map } from 'ol';
import { toast } from 'sonner';

export interface Location {
  lat: number;
  lng: number;
}

export const useMapLocation = (
  map: Map | null,
  setError: (error: string | null) => void
) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const updateMapAndMarker = useCallback((newLocation: Location) => {
    if (!map) return;
    
    setMapMarker(newLocation);
    setLocation(newLocation);
  }, [map]);

  const getMyLocation = useCallback(async () => {
    if (!map) {
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
  }, [map, setError, updateMapAndMarker]);

  return {
    location,
    setLocation: updateMapAndMarker,
    isGettingLocation,
    getMyLocation
  };
};
