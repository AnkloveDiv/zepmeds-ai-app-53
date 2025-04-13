
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, MapPin, Navigation, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { initializeGoogleMaps, mockGeocodeResponse } from "@/utils/googleMapsLoader";

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
  const { toast } = useToast();
  
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Initialize Google Maps API
        const mapsInitialized = await initializeGoogleMaps();
        
        // Check if Google Maps API is available
        if (!window.google || !window.google.maps) {
          console.error("Google Maps API is not loaded after initialization");
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
  
  // Initialize a fallback static map when Google Maps fails
  const initializeFallbackMap = () => {
    setIsLoading(false);
    // Set a default location for fallback
    const defaultLat = 28.6139;
    const defaultLng = 77.2090;
    
    // Use mock data for address
    getAddressFromCoordinates(defaultLat, defaultLng);
  };
  
  const initializeMap = (lat: number, lng: number) => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      setIsLoading(false);
      setUsingMockData(true);
      getAddressFromCoordinates(lat, lng); // Use fallback data
      return;
    }
    
    try {
      console.log("Initializing map with coordinates:", lat, lng);
      const mapOptions: google.maps.MapOptions = {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      };
      
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      const newMarker = new google.maps.Marker({
        position: { lat, lng },
        map: newMap,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#7D41E1",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }
      });
      setMarker(newMarker);
      
      // Get address for initial location
      getAddressFromCoordinates(lat, lng);
      
      // Add event listener for marker drag end
      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition();
        if (position) {
          getAddressFromCoordinates(position.lat(), position.lng());
        }
      });
      
      // Add event listener for map click
      newMap.addListener("click", (e: google.maps.MouseEvent) => {
        const position = e.latLng;
        if (position && newMarker) {
          newMarker.setPosition(position);
          getAddressFromCoordinates(position.lat(), position.lng());
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
  
  const getAddressFromCoordinates = (lat: number, lng: number) => {
    setLoadingAddress(true);
    console.log("Getting address for coordinates:", lat, lng);
    
    // Check if we need to use mock data or if the Google Maps API is available
    if (usingMockData || !window.google || !window.google.maps) {
      const mockResponse = mockGeocodeResponse(lat, lng);
      handleGeocodeResult(mockResponse, lat, lng);
      setLoadingAddress(false);
      return;
    }
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const result = results[0];
        handleGeocodeResult(result, lat, lng);
      } else {
        console.error("Geocoding failed:", status);
        toast({
          title: "Geocoding failed",
          description: "Using fallback address data for this location",
          variant: "destructive",
        });
        
        // Use mock data when geocoding fails
        const mockResponse = mockGeocodeResponse(lat, lng);
        handleGeocodeResult(mockResponse, lat, lng);
      }
      
      setLoadingAddress(false);
    });
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
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setLoadingAddress(true);
    console.log("Searching for address:", searchQuery);
    
    // Check if we need to use mock data
    if (usingMockData || !window.google || !window.google.maps || !map) {
      // Simulate a search delay
      setTimeout(() => {
        // Default coordinates - simulate finding the location
        const lat = 28.6139;
        const lng = 77.2090;
        
        const mockResponse = mockGeocodeResponse(lat, lng);
        handleGeocodeResult(mockResponse, lat, lng);
        
        // If we have a map and marker, update them
        if (map && marker) {
          const location = new google.maps.LatLng(lat, lng);
          marker.setPosition(location);
          map.panTo(location);
          map.setZoom(15);
        }
        
        setLoadingAddress(false);
      }, 1000);
      return;
    }
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0] && results[0].geometry && results[0].geometry.location) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        console.log("Found location:", lat, lng);
        
        if (marker) {
          marker.setPosition(location);
        }
        
        map.panTo(location);
        map.setZoom(15);
        getAddressFromCoordinates(lat, lng);
      } else {
        console.error("Place search failed:", status);
        toast({
          title: "Place not found",
          description: "Using fallback location data",
          variant: "destructive",
        });
        
        // Use mock data when search fails
        const lat = 28.6139;
        const lng = 77.2090;
        const mockResponse = mockGeocodeResponse(lat, lng);
        handleGeocodeResult(mockResponse, lat, lng);
        setLoadingAddress(false);
      }
    });
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);
          
          if (map && marker && window.google && !usingMockData) {
            const location = new google.maps.LatLng(latitude, longitude);
            marker.setPosition(location);
            map.panTo(location);
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
