import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, MapPin, Navigation, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  initializeMap, 
  mockGeocodeResponse, 
  getAddressFromCoordinates,
  searchAddressWithGeoapify,
  getCurrentPosition,
  GEOAPIFY_API_KEY
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
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usingMockData, setUsingMockData] = useState(false);
  const { toast } = useToast();
  
  // For fallback map
  const [fallbackLatitude, setFallbackLatitude] = useState(28.6139);
  const [fallbackLongitude, setFallbackLongitude] = useState(77.2090);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadMap = async () => {
      try {
        // Initialize Leaflet and Geoapify
        const mapsInitialized = await initializeMap();
        
        if (!isMounted) return;
        
        // Check if Leaflet is available
        if (!window.L || !mapsInitialized) {
          console.error("Leaflet is not loaded after initialization");
          toast({
            title: "Maps API not available",
            description: "Using fallback map view. Full functionality may be limited.",
            variant: "destructive",
          });
          setUsingMockData(true);
          setIsLoading(false);
          // Show a fallback/static view with user's location if possible
          getUserLocation();
          return;
        }
        
        // Get user's current location
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
        // Get user location for fallback view
        getUserLocation();
      }
    };
    
    const getUserLocation = async () => {
      setLoadingAddress(true);
      
      try {
        // Try up to 3 times to get an accurate position
        let position;
        let attempt = 0;
        let bestAccuracy = Infinity;
        
        while (attempt < 3 && bestAccuracy > 100) {
          try {
            attempt++;
            console.log(`Getting location attempt ${attempt}`);
            
            // Use enhanced getCurrentPosition function with shorter timeout for retries
            const currentPosition = await getCurrentPosition({
              timeout: attempt < 3 ? 5000 : 10000
            });
            
            // Keep the most accurate position we've seen
            if (currentPosition.coords.accuracy < bestAccuracy) {
              position = currentPosition;
              bestAccuracy = currentPosition.coords.accuracy;
              console.log(`New best accuracy: ${bestAccuracy} meters`);
            }
            
            // If accuracy is good enough, stop trying
            if (bestAccuracy < 100) break;
            
            // Brief pause between attempts
            await new Promise(r => setTimeout(r, 500));
          } catch (err) {
            console.warn(`Attempt ${attempt} failed:`, err);
          }
        }
        
        if (!position) {
          throw new Error("Could not get sufficiently accurate position after multiple attempts");
        }
        
        if (!isMounted) return;
        
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Final position selected with accuracy: ${accuracy} meters`);
        
        // Round to 6 decimal places for better precision
        const roundedLat = parseFloat(latitude.toFixed(6));
        const roundedLng = parseFloat(longitude.toFixed(6));
        
        setFallbackLatitude(roundedLat);
        setFallbackLongitude(roundedLng);
        
        if (!usingMockData && window.L) {
          initializeLeafletMap(roundedLat, roundedLng);
        } else {
          // For fallback map
          setIsLoading(false);
          const addressResult = await getAddressFromCoordinates(roundedLat, roundedLng);
          if (isMounted) {
            handleGeocodeResult(addressResult, roundedLat, roundedLng);
            setLoadingAddress(false);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error getting location:", error);
        // Default to a location if geolocation fails
        toast({
          title: "Location access denied",
          description: "Using default location. Please enable location access for better results.",
          variant: "destructive",
        });
        
        if (!usingMockData && window.L) {
          initializeLeafletMap(28.6139, 77.2090); // New Delhi coordinates as fallback
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
      // Clean up map instance if it exists
      if (map) {
        try {
          map.remove();
        } catch (e) {
          console.error("Error cleaning up map:", e);
        }
      }
    };
  }, [toast, usingMockData]);
  
  const initializeLeafletMap = async (lat: number, lng: number) => {
    if (!mapRef.current || !window.L) {
      setIsLoading(false);
      setUsingMockData(true);
      const addressResult = await getAddressFromCoordinates(lat, lng);
      handleGeocodeResult(addressResult, lat, lng);
      setLoadingAddress(false);
      return;
    }
    
    try {
      console.log("Initializing Leaflet map with coordinates:", lat, lng);
      
      // Initialize Leaflet map
      const leafletMap = window.L.map(mapRef.current, {
        attributionControl: false,  // Remove attribution control (watermark)
        zoomControl: true
      }).setView([lat, lng], 17); // Increased zoom level for better precision
      
      // Add OpenStreetMap tile layer without attribution
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '' // Empty attribution to remove watermark
      }).addTo(leafletMap);
      
      // Add our own minimalistic attribution that doesn't get in the way
      const customAttribution = window.L.control.attribution({
        position: 'bottomright',
        prefix: false
      });
      customAttribution.addTo(leafletMap);
      customAttribution.setPrefix('');
      
      setMap(leafletMap);
      
      // Wait for the map to load
      leafletMap.whenReady(() => {
        console.log("Leaflet map loaded successfully");
        setIsLoading(false);
        
        // Create custom icon with better visibility
        const customIcon = window.L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [30, 45],  // Larger size for better visibility
          iconAnchor: [15, 45], // Center bottom of icon is anchor point
          popupAnchor: [0, -45],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        });
        
        // Add marker for current location
        const mapMarker = window.L.marker([lat, lng], {
          draggable: true,
          autoPan: true,
          icon: customIcon
        }).addTo(leafletMap);
        
        setMarker(mapMarker);
        
        // Get address for initial location
        getAddressFromCoordinates(lat, lng).then(result => {
          handleGeocodeResult(result, lat, lng);
          setLoadingAddress(false);
        });
        
        // Add event listener for marker drag end
        mapMarker.on("dragend", () => {
          const position = mapMarker.getLatLng();
          console.log("Marker dragged to:", position.lat, position.lng);
          if (position) {
            setLoadingAddress(true);
            const roundedLat = parseFloat(position.lat.toFixed(6));
            const roundedLng = parseFloat(position.lng.toFixed(6));
            getAddressFromCoordinates(roundedLat, roundedLng).then(result => {
              handleGeocodeResult(result, roundedLat, roundedLng);
              setLoadingAddress(false);
            });
          }
        });
        
        // Add event listener for map click
        leafletMap.on("click", (e: any) => {
          console.log("Map clicked at:", e.latlng.lat, e.latlng.lng);
          const roundedLat = parseFloat(e.latlng.lat.toFixed(6));
          const roundedLng = parseFloat(e.latlng.lng.toFixed(6));
          mapMarker.setLatLng([roundedLat, roundedLng]);
          setLoadingAddress(true);
          getAddressFromCoordinates(roundedLat, roundedLng).then(result => {
            handleGeocodeResult(result, roundedLat, roundedLng);
            setLoadingAddress(false);
          });
        });
        
        // Add accuracy circle for location
        const accuracyCircle = window.L.circle([lat, lng], {
          radius: 50, // 50 meters accuracy indicator
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.2
        }).addTo(leafletMap);
        
        // Store the accuracy circle for future reference
        leafletMap._accuracyCircle = accuracyCircle;
      });
      
      // Handle map errors
      leafletMap.on('error', (e: any) => {
        console.error("Map error:", e);
        if (!usingMockData) {
          setUsingMockData(true);
          toast({
            title: "Map error occurred",
            description: "Switched to fallback view. Some features may be limited.",
            variant: "destructive",
          });
        }
      });
      
    } catch (error) {
      console.error("Error creating map:", error);
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
    
    const addressComponents = result.address_components;
    
    // Extract address components
    const city = addressComponents.find((c: any) => 
      c.types.includes("locality"))?.long_name || "Unknown City";
    const state = addressComponents.find((c: any) => 
      c.types.includes("administrative_area_level_1"))?.short_name || "Unknown State";
    const zipCode = addressComponents.find((c: any) => 
      c.types.includes("postal_code"))?.long_name || "000000";
    
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
      // Use Geoapify API for geocoding
      const searchResult = await searchAddressWithGeoapify(searchQuery);
      const { lat, lng, address } = searchResult;
      
      // Update fallback coordinates in case we switch to fallback view
      setFallbackLatitude(lat);
      setFallbackLongitude(lng);
      
      // Update marker and map if available
      if (map && marker && !usingMockData) {
        console.log("Updating map and marker to:", lat, lng);
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 17); // Higher zoom level for better precision
        
        // Update accuracy circle
        if (map._accuracyCircle) {
          map._accuracyCircle.setLatLng([lat, lng]);
        }
      }
      
      handleGeocodeResult(address, lat, lng);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Could not find the location. Using default location.",
        variant: "destructive",
      });
      
      // Use mock data when search fails
      const lat = 28.6139;
      const lng = 77.2090;
      const mockResponse = mockGeocodeResponse(lat, lng);
      handleGeocodeResult(mockResponse, lat, lng);
    } finally {
      setLoadingAddress(false);
    }
  };
  
  const handleCurrentLocation = async () => {
    setLoadingAddress(true);
    
    try {
      // Try multiple times to get a good position
      let bestPosition = null;
      let bestAccuracy = Infinity;
      
      for (let i = 0; i < 3; i++) {
        try {
          const position = await getCurrentPosition({ 
            timeout: 5000, 
            maximumAge: 0,
            enableHighAccuracy: true 
          });
          
          if (position.coords.accuracy < bestAccuracy) {
            bestPosition = position;
            bestAccuracy = position.coords.accuracy;
            console.log(`Current location attempt ${i+1}, accuracy: ${bestAccuracy} meters`);
            
            // If we got a good accuracy, don't need more attempts
            if (bestAccuracy < 100) break;
          }
          
          // Small delay between attempts
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.warn(`Attempt ${i+1} to get location failed:`, e);
        }
      }
      
      if (!bestPosition) {
        throw new Error("Could not get accurate position after multiple attempts");
      }
      
      const { latitude, longitude, accuracy } = bestPosition.coords;
      console.log("Current location:", latitude, longitude, "Accuracy:", accuracy);
      
      // Round to 6 decimal places for better precision
      const roundedLat = parseFloat(latitude.toFixed(6));
      const roundedLng = parseFloat(longitude.toFixed(6));
      
      // Update fallback coordinates
      setFallbackLatitude(roundedLat);
      setFallbackLongitude(roundedLng);
      
      if (map && marker && !usingMockData) {
        console.log("Updating map and marker to current location:", roundedLat, roundedLng);
        marker.setLatLng([roundedLat, roundedLng]);
        map.setView([roundedLat, roundedLng], 17); // Higher zoom for better precision
        
        // Add or update accuracy circle - visual indicator of GPS accuracy
        if (map._accuracyCircle) {
          map._accuracyCircle.setLatLng([roundedLat, roundedLng]);
          map._accuracyCircle.setRadius(Math.min(accuracy / 2, 200)); // Cap at 200m for visibility
        } else {
          map._accuracyCircle = window.L.circle([roundedLat, roundedLng], {
            radius: Math.min(accuracy / 2, 200),
            color: 'blue',
            fillColor: '#3388ff',
            fillOpacity: 0.2
          }).addTo(map);
        }
      }
      
      const result = await getAddressFromCoordinates(roundedLat, roundedLng);
      handleGeocodeResult(result, roundedLat, roundedLng);
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location error",
        description: "Could not get your current location",
        variant: "destructive",
      });
    } finally {
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
