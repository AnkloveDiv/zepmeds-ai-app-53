
import React, { useEffect, useRef, useState } from "react";
import { Loader, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initializeMap } from "@/utils/googleMapsLoader";
import { LocationState } from "./useMapLocation";
import { Button } from "@/components/ui/button";

interface GoogleMapProps {
  locationState: LocationState;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDrag: (lat: number, lng: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  usingMockData: boolean;
  setUsingMockData: (usingMock: boolean) => void;
  setMap: (map: google.maps.Map | null) => void;
  setMarker: (marker: google.maps.Marker | null) => void;
  setAccuracyCircle: (circle: google.maps.Circle | null) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  locationState,
  onMapClick,
  onMarkerDrag,
  isLoading,
  setIsLoading,
  usingMockData,
  setUsingMockData,
  setMap,
  setMarker,
  setAccuracyCircle
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  const { toast } = useToast();

  const handleMapRetry = () => {
    setMapLoadError(false);
    setIsLoading(true);
    setUsingMockData(false);
    
    // Force reload the map
    if (locationState.latitude && locationState.longitude) {
      initializeMap().then(success => {
        if (!success) {
          setMapLoadError(true);
          setUsingMockData(true);
          setIsLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeGoogleMap = async (lat: number, lng: number, accuracyInMeters: number = 100) => {
      if (!mapRef.current || !window.google || !window.google.maps) {
        setIsLoading(false);
        setUsingMockData(true);
        setMapLoadError(true);
        return;
      }
      
      try {
        console.log("Initializing Google Map with coordinates:", lat, lng);
        
        const mapOptions: google.maps.MapOptions = {
          center: { lat, lng },
          zoom: accuracyInMeters > 500 ? 15 : (accuracyInMeters > 200 ? 16 : 17),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'greedy'
        };
        
        const googleMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(googleMap);
        
        const markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#FF4500',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 10
        };
        
        const googleMarker = new google.maps.Marker({
          position: { lat, lng },
          map: googleMap,
          draggable: true,
          icon: markerIcon,
          animation: google.maps.Animation.DROP
        });
        
        setMarker(googleMarker);
        setIsLoading(false);
        
        const circle = new google.maps.Circle({
          map: googleMap,
          center: { lat, lng },
          radius: Math.min(accuracyInMeters, 1000),
          fillColor: '#4285F4',
          fillOpacity: 0.15,
          strokeColor: '#4285F4',
          strokeOpacity: 0.5,
          strokeWeight: 1
        });
        
        setAccuracyCircle(circle);
        
        googleMarker.addListener('dragend', () => {
          const position = googleMarker.getPosition();
          if (position) {
            const newLat = position.lat();
            const newLng = position.lng();
            
            console.log("Marker dragged to:", newLat, newLng);
            if (circle) {
              circle.setCenter(position);
            }
            
            onMarkerDrag(newLat, newLng);
          }
        });
        
        googleMap.addListener('click', (e: google.maps.MouseEvent) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          
          console.log("Map clicked at:", newLat, newLng);
          googleMarker.setPosition(e.latLng);
          if (circle) {
            circle.setCenter(e.latLng);
          }
          
          onMapClick(newLat, newLng);
        });
      } catch (error) {
        console.error("Error creating Google map:", error);
        setIsLoading(false);
        setUsingMockData(true);
        setMapLoadError(true);
        toast({
          title: "Map creation failed",
          description: "Using fallback view for location selection.",
          variant: "destructive",
        });
      }
    };

    const loadMap = async () => {
      try {
        const mapsInitialized = await initializeMap();
        
        if (!isMounted) return;
        
        if (!window.google || !window.google.maps || !mapsInitialized) {
          console.error("Google Maps is not loaded after initialization");
          setMapLoadError(true);
          toast({
            title: "Maps API not available",
            description: "Using fallback map view. Full functionality may be limited.",
            variant: "destructive",
          });
          setUsingMockData(true);
          setIsLoading(false);
          return;
        }
        
        // Initialize with the current coordinates
        const { latitude, longitude, accuracy } = locationState;
        await initializeGoogleMap(latitude || locationState.fallbackLatitude, 
          longitude || locationState.fallbackLongitude, 
          accuracy || 1000);
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error during map initialization:", error);
        setIsLoading(false);
        setUsingMockData(true);
        setMapLoadError(true);
        toast({
          title: "Map initialization failed",
          description: "Using fallback view for location selection.",
          variant: "destructive",
        });
      }
    };
    
    if (locationState.latitude && locationState.longitude) {
      loadMap();
    }
    
    return () => {
      isMounted = false;
    };
  }, [locationState.latitude, locationState.longitude, locationState.accuracy, locationState.fallbackLatitude, locationState.fallbackLongitude, setIsLoading, setUsingMockData, setMap, setMarker, setAccuracyCircle, onMapClick, onMarkerDrag, toast]);

  if (usingMockData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <img 
          src="/lovable-uploads/92febc6f-53c5-4316-8532-8912db81a86e.png" 
          alt="Map placeholder" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
        />
        
        {mapLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-black/70 p-6 rounded-xl max-w-[80%] text-center">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">Map loading failed</h3>
              <p className="text-gray-300 mb-4">
                We couldn't load the Google Maps. This could be due to network issues or an invalid API key.
              </p>
              <Button 
                onClick={handleMapRetry} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <Loader className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full" 
        id="map-container"
      />
    </div>
  );
};

export default GoogleMap;
