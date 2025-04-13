
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, MapPin, Navigation, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  initializeMapplsMaps, 
  mockGeocodeResponse, 
  getAddressFromMapplsCoordinates,
  searchAddressWithMappls
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
  
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Initialize Mappls Maps API
        const mapsInitialized = await initializeMapplsMaps();
        
        // Check if Mappls Maps API is available
        if (!window.mappls) {
          console.error("Mappls Maps API is not loaded after initialization");
          toast({
            title: "Maps API not available",
            description: "Using fallback map view. Full functionality may be limited.",
            variant: "destructive",
          });
          setUsingMockData(true);
          setIsLoading(false);
          // Show a fallback/static view
          initializeFallbackMap();
          return;
        }
        
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Got user location:", latitude, longitude);
              initializeMap(latitude, longitude);
            },
            (error) => {
              console.error("Error getting location:", error);
              // Default to a location if geolocation fails
              toast({
                title: "Location access denied",
                description: "Using default location. Please enable location access for better results.",
                variant: "destructive",
              });
              initializeMap(28.6139, 77.2090); // New Delhi coordinates as fallback
            }
          );
        } else {
          console.error("Geolocation not supported by this browser");
          toast({
            title: "Geolocation not supported",
            description: "Your browser doesn't support geolocation. Using default location.",
            variant: "destructive",
          });
          initializeMap(28.6139, 77.2090); // New Delhi coordinates as fallback
        }
      } catch (error) {
        console.error("Error during map initialization:", error);
        setIsLoading(false);
        setUsingMockData(true);
        toast({
          title: "Map initialization failed",
          description: "Using fallback view for location selection.",
          variant: "destructive",
        });
        initializeFallbackMap();
      }
    };
    
    loadMap();
  }, [toast]);
  
  // Initialize a fallback static map when Mappls Maps fails
  const initializeFallbackMap = () => {
    setIsLoading(false);
    // Set a default location for fallback
    const defaultLat = 28.6139;
    const defaultLng = 77.2090;
    
    // Use mock data for address
    getAddressFromCoordinates(defaultLat, defaultLng);
  };
  
  const initializeMap = (lat: number, lng: number) => {
    if (!mapRef.current || !window.mappls) {
      setIsLoading(false);
      setUsingMockData(true);
      getAddressFromCoordinates(lat, lng); // Use fallback data
      return;
    }
    
    try {
      console.log("Initializing map with coordinates:", lat, lng);
      
      // Initialize Mappls map
      const mapplsMap = new window.mappls.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        search: false,
        location: false,
        zoomControl: true,
      });
      
      setMap(mapplsMap);
      
      // Add a marker at the initial location
      const mapMarker = new window.mappls.Marker({
        map: mapplsMap,
        position: { lat, lng },
        draggable: true,
        fitbounds: true,
        icon: {
          url: 'https://apis.mapmyindia.com/map_v3/1.png',
          width: 28,
          height: 38
        }
      });
      
      setMarker(mapMarker);
      
      // Get address for initial location
      getAddressFromCoordinates(lat, lng);
      
      // Add event listener for marker drag end
      mapMarker.addListener("dragend", () => {
        const position = mapMarker.getPosition();
        if (position) {
          getAddressFromCoordinates(position.lat, position.lng);
        }
      });
      
      // Add event listener for map click
      mapplsMap.addListener("click", (e: any) => {
        if (e.latlng && mapMarker) {
          const { lat, lng } = e.latlng;
          mapMarker.setPosition({ lat, lng });
          getAddressFromCoordinates(lat, lng);
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating map:", error);
      setIsLoading(false);
      setUsingMockData(true);
      toast({
        title: "Map creation failed",
        description: "Using fallback view for location selection.",
        variant: "destructive",
      });
      getAddressFromCoordinates(lat, lng); // Use fallback data
    }
  };
  
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    console.log("Getting address for coordinates:", lat, lng);
    
    try {
      // Check if we need to use mock data or if the Mappls API is available
      if (usingMockData || !window.mappls) {
        const mockResponse = mockGeocodeResponse(lat, lng);
        handleGeocodeResult(mockResponse, lat, lng);
      } else {
        // Use Mappls reverse geocoding
        const result = await getAddressFromMapplsCoordinates(lat, lng);
        handleGeocodeResult(result, lat, lng);
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      const mockResponse = mockGeocodeResponse(lat, lng);
      handleGeocodeResult(mockResponse, lat, lng);
    }
    
    setLoadingAddress(false);
  };
  
  const handleGeocodeResult = (result: any, lat: number, lng: number) => {
    console.log("Processing geocode result:", result);
    
    const addressComponents = result.address_components;
    
    // Extract address components
    const city = addressComponents.find((c: any) => 
      c.types.includes("locality"))?.long_name || "Gurugram";
    const state = addressComponents.find((c: any) => 
      c.types.includes("administrative_area_level_1"))?.short_name || "HR";
    const zipCode = addressComponents.find((c: any) => 
      c.types.includes("postal_code"))?.long_name || "122001";
    
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
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoadingAddress(true);
    console.log("Searching for address:", searchQuery);
    
    try {
      // Check if we need to use mock data
      if (usingMockData || !window.mappls) {
        // Simulate a search delay
        setTimeout(() => {
          // Default coordinates - simulate finding the location
          const lat = 28.6139;
          const lng = 77.2090;
          
          const mockResponse = mockGeocodeResponse(lat, lng);
          handleGeocodeResult(mockResponse, lat, lng);
          
          setLoadingAddress(false);
        }, 1000);
        return;
      }
      
      // Use Mappls API for geocoding
      const searchResult = await searchAddressWithMappls(searchQuery);
      const { lat, lng, address } = searchResult;
      
      // Update marker and map if available
      if (map && marker) {
        marker.setPosition({ lat, lng });
        map.setCenter({ lat, lng });
        map.setZoom(15);
      }
      
      handleGeocodeResult(address, lat, lng);
      setLoadingAddress(false);
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
      setLoadingAddress(false);
    }
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);
          
          if (map && marker && window.mappls && !usingMockData) {
            marker.setPosition({ lat: latitude, lng: longitude });
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(15);
          }
          
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Could not get your current location",
            variant: "destructive",
          });
          setLoadingAddress(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
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
              src="/lovable-uploads/84437780-633b-44bd-a488-f1dc157c50e5.png" 
              alt="Map placeholder" 
              className="absolute inset-0 w-full h-full object-cover opacity-40" 
            />
          </div>
        ) : (
          <div 
            ref={mapRef} 
            className="w-full h-full" 
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
              <div className="flex items-center gap-2 mt-2">
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
