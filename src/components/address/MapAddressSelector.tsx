
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
  searchAddressWithMapTiler
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
        // Initialize MapTiler SDK
        const mapsInitialized = await initializeMap();
        
        // Check if MapTiler SDK is available
        if (!window.maptilersdk) {
          console.error("MapTiler SDK is not loaded after initialization");
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
              initializeMapTiler(latitude, longitude);
            },
            (error) => {
              console.error("Error getting location:", error);
              // Default to a location if geolocation fails
              toast({
                title: "Location access denied",
                description: "Using default location. Please enable location access for better results.",
                variant: "destructive",
              });
              initializeMapTiler(28.6139, 77.2090); // New Delhi coordinates as fallback
            }
          );
        } else {
          console.error("Geolocation not supported by this browser");
          toast({
            title: "Geolocation not supported",
            description: "Your browser doesn't support geolocation. Using default location.",
            variant: "destructive",
          });
          initializeMapTiler(28.6139, 77.2090); // New Delhi coordinates as fallback
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
  
  // Initialize a fallback static map when MapTiler fails
  const initializeFallbackMap = () => {
    setIsLoading(false);
    // Set a default location for fallback
    const defaultLat = 28.6139;
    const defaultLng = 77.2090;
    
    // Use mock data for address
    getAddressFromCoordinates(defaultLat, defaultLng).then(result => {
      handleGeocodeResult(result, defaultLat, defaultLng);
    });
  };
  
  const initializeMapTiler = (lat: number, lng: number) => {
    if (!mapRef.current || !window.maptilersdk) {
      setIsLoading(false);
      setUsingMockData(true);
      getAddressFromCoordinates(lat, lng).then(result => {
        handleGeocodeResult(result, lat, lng);
      }); // Use fallback data
      return;
    }
    
    try {
      console.log("Initializing map with coordinates:", lat, lng);
      
      // Initialize MapTiler map
      const maptilerMap = new window.maptilersdk.Map({
        container: mapRef.current,
        style: window.maptilersdk.MapStyle.STREETS,
        center: [lng, lat], // MapTiler uses [lng, lat] format for coordinates
        zoom: 15
      });
      
      setMap(maptilerMap);
      
      // Wait for the map to load
      maptilerMap.on('load', () => {
        console.log("Map loaded successfully");
        
        // Check if maplibregl is available for marker
        if (!window.maplibregl) {
          console.error("maplibregl not found");
          setIsLoading(false);
          return;
        }
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.width = '25px';
        markerElement.style.height = '41px';
        markerElement.style.backgroundImage = 'url(https://docs.maptiler.com/sdk-js/assets/marker-icon.png)';
        markerElement.style.backgroundSize = 'cover';
        markerElement.style.cursor = 'pointer';
        
        // Add a marker at the initial location
        const mapMarker = new window.maplibregl.Marker({
          element: markerElement,
          draggable: true
        })
          .setLngLat([lng, lat])
          .addTo(maptilerMap);
        
        setMarker(mapMarker);
        setIsLoading(false);
        
        // Get address for initial location
        getAddressFromCoordinates(lat, lng).then(result => {
          handleGeocodeResult(result, lat, lng);
        });
        
        // Add event listener for marker drag end
        mapMarker.on("dragend", () => {
          const position = mapMarker.getLngLat();
          if (position) {
            getAddressFromCoordinates(position.lat, position.lng).then(result => {
              handleGeocodeResult(result, position.lat, position.lng);
            });
          }
        });
        
        // Add event listener for map click
        maptilerMap.on("click", (e: any) => {
          const { lng, lat } = e.lngLat;
          mapMarker.setLngLat([lng, lat]);
          getAddressFromCoordinates(lat, lng).then(result => {
            handleGeocodeResult(result, lat, lng);
          });
        });
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
      getAddressFromCoordinates(lat, lng).then(result => {
        handleGeocodeResult(result, lat, lng);
      }); // Use fallback data
    }
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
    setLoadingAddress(false);
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoadingAddress(true);
    console.log("Searching for address:", searchQuery);
    
    try {
      // Check if we need to use mock data
      if (usingMockData || !window.maptilersdk) {
        // Simulate a search delay
        setTimeout(() => {
          // Default coordinates - simulate finding the location
          const lat = 28.6139;
          const lng = 77.2090;
          
          const mockResponse = mockGeocodeResponse(lat, lng);
          handleGeocodeResult(mockResponse, lat, lng);
        }, 1000);
        return;
      }
      
      // Use MapTiler API for geocoding
      const searchResult = await searchAddressWithMapTiler(searchQuery);
      const { lat, lng, address } = searchResult;
      
      // Update marker and map if available
      if (map && marker) {
        marker.setLngLat([lng, lat]);
        map.flyTo({center: [lng, lat], zoom: 15});
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
    }
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);
          
          if (map && marker && window.maptilersdk && !usingMockData) {
            marker.setLngLat([longitude, latitude]);
            map.flyTo({center: [longitude, latitude], zoom: 15});
          }
          
          getAddressFromCoordinates(latitude, longitude).then(result => {
            handleGeocodeResult(result, latitude, longitude);
          });
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
              src="/lovable-uploads/9e2b1e9d-5039-4c63-86a6-2dff8f9e8572.png" 
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
