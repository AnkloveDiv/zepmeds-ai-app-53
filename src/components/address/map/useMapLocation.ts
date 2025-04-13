
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentPosition } from "@/utils/googleMapsLoader";

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  locationPermissionDenied: boolean;
  highAccuracyFailed: boolean;
  showingAccuracyHelp: boolean;
  fallbackLatitude: number;
  fallbackLongitude: number;
}

export function useMapLocation(disableWarnings = true) {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    accuracy: 1000,
    locationPermissionDenied: false,
    highAccuracyFailed: false,
    showingAccuracyHelp: false,
    fallbackLatitude: 28.6139,
    fallbackLongitude: 77.2090
  });

  const [locationRetries, setLocationRetries] = useState(0);
  const [accuracyRetryAttempts, setAccuracyRetryAttempts] = useState(0);
  const { toast } = useToast();

  const handleCurrentLocation = async () => {
    try {
      setLocationState(prev => ({
        ...prev,
        locationPermissionDenied: false,
        showingAccuracyHelp: false
      }));
      
      let bestPosition = null;
      let bestAccuracy = Infinity;
      
      for (let i = 0; i < 12; i++) {
        try {
          console.log(`Current location attempt ${i+1}`);
          const position = await getCurrentPosition({ 
            timeout: 3000, 
            maximumAge: 0,
            enableHighAccuracy: true 
          });
          
          if (position.coords.accuracy < bestAccuracy) {
            bestPosition = position;
            bestAccuracy = position.coords.accuracy;
            console.log(`Current location attempt ${i+1}, accuracy: ${bestAccuracy} meters`);
            
            if (bestAccuracy < 100) break;
          }
          
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.warn(`Attempt ${i+1} to get location failed:`, e);
          
          if (i === 4) {
            try {
              const lowAccuracyPosition = await getCurrentPosition({
                timeout: 5000,
                maximumAge: 0,
                enableHighAccuracy: false
              });
              
              if (!bestPosition || lowAccuracyPosition.coords.accuracy < bestAccuracy) {
                bestPosition = lowAccuracyPosition;
                bestAccuracy = lowAccuracyPosition.coords.accuracy;
                setLocationState(prev => ({
                  ...prev,
                  highAccuracyFailed: true
                }));
              }
            } catch (lowAccErr) {
              console.warn("Even low accuracy failed:", lowAccErr);
            }
          }
          
          if (e instanceof GeolocationPositionError && e.code === 1) {
            setLocationState(prev => ({
              ...prev,
              locationPermissionDenied: true
            }));
            
            if (!disableWarnings) {
              toast({
                title: "Location access denied",
                description: "Please enable location access in your browser settings.",
                variant: "destructive",
              });
            }
            break;
          }
        }
      }
      
      if (!bestPosition) {
        if (!disableWarnings) {
          toast({
            title: "Location error",
            description: "Could not get an accurate location. Try moving to an open area or check your device settings.",
            variant: "destructive",
          });
        }
        return null;
      }
      
      const { latitude, longitude, accuracy } = bestPosition.coords;
      console.log("Current location:", latitude, longitude, "Accuracy:", accuracy);

      // Only show accuracy toasts if warnings are not disabled
      const showAccuracyToast = () => {
        if (disableWarnings) return;
        
        if (accuracy > 1000) {
          setLocationState(prev => ({
            ...prev,
            showingAccuracyHelp: true
          }));
          toast({
            title: "Very limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy/1000)} km. Please manually adjust the pin.`,
            variant: "destructive",
          });
        } else if (accuracy > 100) {
          toast({
            title: "Limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy)} meters. You can drag the pin to adjust.`,
            variant: "destructive",
          });
        }
      };
      
      if (!disableWarnings) {
        showAccuracyToast();
      }

      setLocationState(prev => ({
        ...prev,
        latitude,
        longitude,
        accuracy,
        fallbackLatitude: latitude,
        fallbackLongitude: longitude
      }));
      
      return { latitude, longitude, accuracy };
    } catch (error) {
      console.error("Error getting location:", error);
      if (!disableWarnings) {
        toast({
          title: "Location error",
          description: "Could not get your current location. Please check your location settings.",
          variant: "destructive",
        });
      }
      return null;
    }
  };

  const getUserLocation = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error("Browser does not support geolocation");
      }
      
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setLocationState(prev => ({
            ...prev,
            locationPermissionDenied: true
          }));
          throw new Error("Location permission is denied");
        }
      } catch (permError) {
        console.warn("Could not check permission status:", permError);
      }
      
      let position;
      let attempt = 0;
      let bestAccuracy = Infinity;
      const maxAttempts = 12;
      
      while (attempt < maxAttempts && bestAccuracy > 100) {
        try {
          attempt++;
          console.log(`Getting location attempt ${attempt}`);
          
          const currentPosition = await getCurrentPosition({
            timeout: attempt < 8 ? 3000 : 5000,
            maximumAge: 0,
            enableHighAccuracy: true
          });
          
          if (currentPosition.coords.accuracy < bestAccuracy) {
            position = currentPosition;
            bestAccuracy = currentPosition.coords.accuracy;
            console.log(`New best accuracy: ${bestAccuracy} meters`);
            
            if (bestAccuracy < 100) {
              console.log("Good enough accuracy achieved, stopping attempts");
              break;
            }
          }
          
          if (attempt < maxAttempts) {
            await new Promise(r => setTimeout(r, 300));
          }
        } catch (err) {
          console.warn(`Attempt ${attempt} failed:`, err);
          
          if (attempt === 5) {
            try {
              console.log("Trying with high accuracy disabled");
              const lowAccuracyPosition = await getCurrentPosition({
                timeout: 5000,
                maximumAge: 0,
                enableHighAccuracy: false
              });
              
              if (!position || lowAccuracyPosition.coords.accuracy < bestAccuracy) {
                position = lowAccuracyPosition;
                bestAccuracy = lowAccuracyPosition.coords.accuracy;
                setLocationState(prev => ({
                  ...prev,
                  highAccuracyFailed: true
                }));
              }
            } catch (lowAccErr) {
              console.warn("Even low accuracy failed:", lowAccErr);
            }
          }
        }
      }
      
      if (!position && accuracyRetryAttempts < 2) {
        setAccuracyRetryAttempts(prev => prev + 1);
        if (!disableWarnings) {
          toast({
            title: "Location accuracy poor",
            description: "Trying again to get a more accurate position...",
          });
        }
        await new Promise(r => setTimeout(r, 500));
        return await getUserLocation();
      }
      
      if (!position) {
        throw new Error("Could not get position after multiple attempts");
      }
      
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Final position selected with accuracy: ${accuracy} meters`);
      
      // Only show accuracy warnings if not disabled
      if (!disableWarnings) {
        if (accuracy > 1000) {
          setLocationState(prev => ({
            ...prev,
            showingAccuracyHelp: true
          }));
          toast({
            title: "Very limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy/1000)} km. Please check location settings and enable GPS.`,
            variant: "destructive",
          });
        } else if (accuracy > 100) {
          toast({
            title: "Limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy)} meters. You can drag the pin to adjust.`,
            variant: "destructive",
          });
        }
      }
      
      setLocationState(prev => ({
        ...prev,
        latitude, 
        longitude, 
        accuracy,
        fallbackLatitude: latitude,
        fallbackLongitude: longitude
      }));
      
      return { latitude, longitude, accuracy };
    } catch (error) {
      console.error("Error getting initial location:", error);
      
      if (error instanceof GeolocationPositionError && error.code === 1) {
        setLocationState(prev => ({
          ...prev,
          locationPermissionDenied: true
        }));
        if (!disableWarnings) {
          toast({
            title: "Location access denied",
            description: "You need to enable location services in your browser settings.",
            variant: "destructive",
          });
        }
      } else if (!disableWarnings) {
        toast({
          title: "Location error",
          description: "Could not get accurate location. You can manually set location by dragging the pin.",
          variant: "destructive",
        });
      }
      
      // Return fallback coordinates
      return { 
        latitude: locationState.fallbackLatitude, 
        longitude: locationState.fallbackLongitude, 
        accuracy: 1000 
      };
    }
  };

  const retryLocation = () => {
    setLocationRetries(prev => prev + 1);
  };

  return {
    locationState,
    setLocationState,
    getUserLocation,
    handleCurrentLocation,
    retryLocation,
    locationRetries,
    accuracyRetryAttempts
  };
}
