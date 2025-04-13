import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, MapPin, Navigation, Search, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  initializeMap, 
  getAddressFromCoordinates,
  searchAddressWithGoogle,
  getCurrentPosition
} from "@/utils/googleMapsLoader";

interface MapAddressSelectorProps {
  onAddressSelected: (address: AddressDetails) => void;
  onCancel: () => void;
}

interface AddressDetails {
  fullAddress: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
}

const MapAddressSelector = ({ onAddressSelected, onCancel }: MapAddressSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usingMockData, setUsingMockData] = useState(false);
  const [locationRetries, setLocationRetries] = useState(0);
  const [accuracyRetryAttempts, setAccuracyRetryAttempts] = useState(0);
  const [showingAccuracyHelp, setShowingAccuracyHelp] = useState(false);
  const { toast } = useToast();
  
  const [fallbackLatitude, setFallbackLatitude] = useState(28.6139);
  const [fallbackLongitude, setFallbackLongitude] = useState(77.2090);
  
  const [accuracyCircle, setAccuracyCircle] = useState<google.maps.Circle | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [highAccuracyFailed, setHighAccuracyFailed] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadMap = async () => {
      try {
        const mapsInitialized = await initializeMap();
        
        if (!isMounted) return;
        
        if (!window.google || !window.google.maps || !mapsInitialized) {
          console.error("Go Maps is not loaded after initialization");
          toast({
            title: "Maps API not available",
            description: "Using fallback map view. Full functionality may be limited.",
            variant: "destructive",
          });
          setUsingMockData(true);
          setIsLoading(false);
          getUserLocation();
          return;
        }
        
        getUserLocation();
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error during map initialization:", error);
        setIsLoading(false);
        setUsingMockData(true);
        toast({
          title: "Map initialization failed",
          description: "Using fallback view for location selection.",
          variant: "destructive",
        });
        getUserLocation();
      }
    };
    
    const getUserLocation = async () => {
      setLoadingAddress(true);
      
      try {
        if (!navigator.geolocation) {
          throw new Error("Browser does not support geolocation");
        }
        
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          if (permissionStatus.state === 'denied') {
            setLocationPermissionDenied(true);
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
                  setHighAccuracyFailed(true);
                }
              } catch (lowAccErr) {
                console.warn("Even low accuracy failed:", lowAccErr);
              }
            }
          }
        }
        
        if (!position && accuracyRetryAttempts < 2) {
          setAccuracyRetryAttempts(prev => prev + 1);
          toast({
            title: "Location accuracy poor",
            description: "Trying again to get a more accurate position...",
          });
          await new Promise(r => setTimeout(r, 500));
          getUserLocation();
          return;
        }
        
        if (!isMounted) return;
        
        if (!position) {
          throw new Error("Could not get position after multiple attempts");
        }
        
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Final position selected with accuracy: ${accuracy} meters`);
        
        if (accuracy > 1000) {
          setShowingAccuracyHelp(true);
          toast({
            title: "Very limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy/1000)} km. Please check location settings and enable GPS.`,
            variant: "warning",
          });
        } else if (accuracy > 100) {
          toast({
            title: "Limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy)} meters. You can drag the pin to adjust.`,
            variant: "warning",
          });
        }
        
        setFallbackLatitude(latitude);
        setFallbackLongitude(longitude);
        
        if (!usingMockData && window.google && window.google.maps) {
          initializeGoogleMap(latitude, longitude, accuracy);
        } else {
          setIsLoading(false);
          const addressResult = await getAddressFromCoordinates(latitude, longitude);
          if (isMounted) {
            handleGeocodeResult(addressResult, latitude, longitude);
            setLoadingAddress(false);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error getting location:", error);
        
        if (error instanceof GeolocationPositionError && error.code === 1) {
          setLocationPermissionDenied(true);
          toast({
            title: "Location access denied",
            description: "You need to enable location services in your browser settings.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Location error",
            description: "Could not get accurate location. You can manually set location by dragging the pin.",
            variant: "destructive",
          });
        }
        
        if (!usingMockData && window.google && window.google.maps) {
          initializeGoogleMap(28.6139, 77.2090, 1000);
        } else {
          setIsLoading(false);
          const addressResult = await getAddressFromCoordinates(28.6139, 77.2090);
          if (isMounted) {
            handleGeocodeResult(addressResult, 28.6139, 77.2090);
            setLoadingAddress(false);
          }
        }
      }
    };
    
    loadMap();
    
    return () => {
      isMounted = false;
      if (marker) {
        marker.setMap(null);
      }
      if (accuracyCircle) {
        accuracyCircle.setMap(null);
      }
    };
  }, [toast, usingMockData, locationRetries, accuracyRetryAttempts]);
  
  const initializeGoogleMap = async (lat: number, lng: number, accuracyInMeters: number = 100) => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      setIsLoading(false);
      setUsingMockData(true);
      const addressResult = await getAddressFromCoordinates(lat, lng);
      handleGeocodeResult(addressResult, lat, lng);
      setLoadingAddress(false);
      return;
    }
    
    try {
      console.log("Initializing Go Map with coordinates:", lat, lng);
      
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
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'accuracy-info';
      infoDiv.innerHTML = `
        <div style="background-color: rgba(0,0,0,0.7); color: white; padding: 6px 10px; border-radius: 4px; font-size: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 10px; height: 10px; background-color: #4285F4; border-radius: 50%; margin-right: 6px;"></span>
          Location accuracy: ${Math.round(accuracyInMeters)} meters
        </div>
      `;
      googleMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(infoDiv);
      
      googleMarker.addListener('dragend', () => {
        const position = googleMarker.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          
          console.log("Marker dragged to:", newLat, newLng);
          if (accuracyCircle) {
            circle.setCenter(position);
          }
          
          setLoadingAddress(true);
          getAddressFromCoordinates(newLat, newLng).then(result => {
            handleGeocodeResult(result, newLat, newLng);
            setLoadingAddress(false);
          });
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
        
        setLoadingAddress(true);
        getAddressFromCoordinates(newLat, newLng).then(result => {
          handleGeocodeResult(result, newLat, newLng);
          setLoadingAddress(false);
        });
      });
      
      const addressResult = await getAddressFromCoordinates(lat, lng);
      handleGeocodeResult(addressResult, lat, lng);
    } catch (error) {
      console.error("Error creating Go map:", error);
      setIsLoading(false);
      setUsingMockData(true);
      toast({
        title: "Map creation failed",
        description: "Using fallback view for location selection.",
        variant: "destructive",
      });
      const addressResult = await getAddressFromCoordinates(lat, lng);
      handleGeocodeResult(addressResult, lat, lng);
      setLoadingAddress(false);
    }
  };
  
  const handleGeocodeResult = (result: any, lat: number, lng: number) => {
    console.log("Processing geocode result:", result);
    
    let city = "Unknown City";
    let state = "Unknown State";
    let zipCode = "000000";
    
    if (result.address_components) {
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }
    }
    
    const addressDetails: AddressDetails = {
      fullAddress: result.formatted_address || `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      latitude: lat,
      longitude: lng,
      city,
      state,
      zipCode
    };
    
    console.log("Address details:", addressDetails);
    setSelectedAddress(addressDetails);
    setLoadingAddress(false);
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoadingAddress(true);
    console.log("Searching for address:", searchQuery);
    
    try {
      const searchResult = await searchAddressWithGoogle(searchQuery);
      const { lat, lng, address } = searchResult;
      
      setFallbackLatitude(lat);
      setFallbackLongitude(lng);
      
      if (map && marker && !usingMockData) {
        console.log("Updating map and marker to:", lat, lng);
        marker.setPosition({ lat, lng });
        map.panTo({ lat, lng });
        map.setZoom(17);
        
        if (accuracyCircle) {
          accuracyCircle.setCenter({ lat, lng });
        }
      }
      
      handleGeocodeResult(address, lat, lng);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Could not find the location. Please try a different search term.",
        variant: "destructive",
      });
      setLoadingAddress(false);
    }
  };
  
  const handleCurrentLocation = async () => {
    setLoadingAddress(true);
    setShowingAccuracyHelp(false);
    
    try {
      setLocationPermissionDenied(false);
      
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
                setHighAccuracyFailed(true);
              }
            } catch (lowAccErr) {
              console.warn("Even low accuracy failed:", lowAccErr);
            }
          }
          
          if (e instanceof GeolocationPositionError && e.code === 1) {
            setLocationPermissionDenied(true);
            toast({
              title: "Location access denied",
              description: "Please enable location access in your browser settings.",
              variant: "destructive",
            });
            break;
          }
        }
      }
      
      if (!bestPosition) {
        toast({
          title: "Location error",
          description: "Could not get an accurate location. Try moving to an open area or check your device settings.",
          variant: "destructive",
        });
        setLoadingAddress(false);
        return;
      }
      
      const { latitude, longitude, accuracy } = bestPosition.coords;
      console.log("Current location:", latitude, longitude, "Accuracy:", accuracy);
      
      setFallbackLatitude(latitude);
      setFallbackLongitude(longitude);
      
      if (map && marker && !usingMockData) {
        console.log("Updating map and marker to current location:", latitude, longitude);
        marker.setPosition({ lat: latitude, lng: longitude });
        map.panTo({ lat: latitude, lng: longitude });
        
        if (accuracyCircle) {
          accuracyCircle.setCenter({ lat: latitude, lng: longitude });
          accuracyCircle.setRadius(Math.min(accuracy, 1000));
        }
        
        if (accuracy > 500) {
          map.setZoom(14);
        } else if (accuracy > 200) {
          map.setZoom(15);
        } else if (accuracy > 50) {
          map.setZoom(16);
        } else {
          map.setZoom(17);
        }
        
        if (accuracy > 1000) {
          setShowingAccuracyHelp(true);
          toast({
            title: "Very limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy/1000)} km. Please manually adjust the pin.`,
            variant: "warning",
          });
        } else if (accuracy > 100) {
          toast({
            title: "Limited accuracy",
            description: `Location accurate to within ${Math.round(accuracy)} meters. You can drag the pin to adjust.`,
            variant: "warning",
          });
        }
      }
      
      const result = await getAddressFromCoordinates(latitude, longitude);
      handleGeocodeResult(result, latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location error",
        description: "Could not get your current location. Please check your location settings.",
        variant: "destructive",
      });
      setLoadingAddress(false);
    }
  };
  
  const handleConfirmAddress = () => {
    if (selectedAddress) {
      onAddressSelected(selectedAddress);
    }
  };
  
  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10 bg-black/20 border-gray-700"
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleCurrentLocation}
          className="bg-orange-500/10 text-orange-500 border-orange-500/50 hover:bg-orange-500/20"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      {locationPermissionDenied && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Location access denied</AlertTitle>
          <AlertDescription>
            Enable location access in your browser settings to get accurate location data. Until then, you can manually select a location on the map.
          </AlertDescription>
        </Alert>
      )}
      
      {showingAccuracyHelp && (
        <Alert variant="warning" className="mb-4">
          <Info className="h-5 w-5" />
          <AlertTitle>Improve location accuracy</AlertTitle>
          <AlertDescription>
            <p className="mb-2">To get better location accuracy:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Enable GPS on your device</li>
              <li>Move to an area with better GPS signal (near windows or outdoors)</li>
              <li>Try another browser (Chrome often has best location accuracy)</li>
              <li>Manually adjust the pin to your exact location</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="relative flex-1 mb-4 rounded-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
            <Loader className="h-8 w-8 text-zepmeds-purple animate-spin" />
          </div>
        )}
        {usingMockData ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 relative">
            <div className="text-center p-6 bg-black/70 rounded-xl max-w-[80%] z-10">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-xl font-semibold mb-2">Map Service Limited</h3>
              <p className="text-gray-400 mb-4">
                Map services are currently limited. You can still select a location using the current coordinates.
              </p>
              {selectedAddress && (
                <div className="text-sm bg-gray-700/50 p-2 rounded">
                  <p className="text-blue-400">{selectedAddress.fullAddress}</p>
                  <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      {selectedAddress.city}
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                      {selectedAddress.state}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            <img 
              src="/lovable-uploads/92febc6f-53c5-4316-8532-8912db81a86e.png" 
              alt="Map placeholder" 
              className="absolute inset-0 w-full h-full object-cover opacity-40" 
            />
          </div>
        ) : (
          <div 
            ref={mapRef} 
            className="w-full h-full" 
            id="map-container"
          />
        )}
        <div className="absolute top-2 right-2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="bg-black/70 text-white border-gray-700 hover:bg-black/90"
            onClick={handleCurrentLocation}
          >
            <Navigation className="mr-2 h-4 w-4 text-green-500" />
            My Location
          </Button>
        </div>
        {!isLoading && !usingMockData && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black/70 px-3 py-2 rounded-full text-white text-sm flex items-center shadow-lg">
              <MapPin className="h-4 w-4 text-red-500 mr-2" />
              <span>Drag marker or tap to select location</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="glass-morphism rounded-xl p-4">
          <Label className="text-gray-400 text-sm">Selected Address</Label>
          {loadingAddress ? (
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Getting address...</span>
            </div>
          ) : selectedAddress ? (
            <div className="mt-1">
              <p className="text-white">{selectedAddress.fullAddress}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  {selectedAddress.city}
                </div>
                <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  {selectedAddress.state}
                </div>
                <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  {selectedAddress.zipCode}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Coordinates: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No address selected</p>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-700" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
            disabled={!selectedAddress || loadingAddress}
            onClick={handleConfirmAddress}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapAddressSelector;
