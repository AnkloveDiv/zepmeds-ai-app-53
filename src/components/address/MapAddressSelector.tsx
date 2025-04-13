
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAddressFromCoordinates } from "@/utils/googleMapsLoader";
import { useMapLocation } from "./map/useMapLocation";
import { useAddressSearch } from "./map/useAddressSearch";
import AlertMessages from "./map/AlertMessages";
import SearchBar from "./map/SearchBar";
import GoogleMap from "./map/GoogleMap";
import AddressInfoDisplay from "./map/AddressInfoDisplay";
import MapOverlays from "./map/MapOverlays";
import { AddressDetails } from "./map/AddressInfoDisplay";

interface MapAddressSelectorProps {
  onAddressSelected: (address: AddressDetails) => void;
  onCancel: () => void;
}

const MapAddressSelector = ({ onAddressSelected, onCancel }: MapAddressSelectorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [accuracyCircle, setAccuracyCircle] = useState<google.maps.Circle | null>(null);
  const [disableAccuracyWarnings, setDisableAccuracyWarnings] = useState(true);
  const [mapRetryCount, setMapRetryCount] = useState(0);

  const { 
    locationState, 
    setLocationState,
    getUserLocation, 
    handleCurrentLocation 
  } = useMapLocation(true); // true to disable warnings
  
  const {
    loadingAddress,
    selectedAddress,
    handleSearch,
    handleCoordinateChange,
    handleGeocodeResult
  } = useAddressSearch();
  
  const { toast } = useToast();

  const handleMapLocationUpdate = (lat: number, lng: number) => {
    handleCoordinateChange(lat, lng);
  };

  const handleAddressSearch = async (query: string) => {
    const result = await handleSearch(query);
    if (result && map && marker && !usingMockData) {
      const { lat, lng } = result;
      
      setLocationState(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));
      
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
      map.setZoom(17);
      
      if (accuracyCircle) {
        accuracyCircle.setCenter({ lat, lng });
      }
    }
  };

  const handleLocationButtonClick = async () => {
    setMapRetryCount(prev => prev + 1);
    const position = await handleCurrentLocation();
    if (position && map && marker && !usingMockData) {
      const { latitude, longitude, accuracy } = position;
      
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
      
      handleCoordinateChange(latitude, longitude);
    } else if (usingMockData) {
      // Force location detection even in mock mode
      toast({
        title: "Using current location",
        description: "Getting your current location",
      });
      
      try {
        const position = await getUserLocation();
        if (position) {
          const { latitude, longitude } = position;
          const addressResult = await getAddressFromCoordinates(latitude, longitude);
          handleGeocodeResult(addressResult, latitude, longitude);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: "Could not get your location. Please enter an address manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleConfirmAddress = () => {
    if (selectedAddress) {
      onAddressSelected(selectedAddress);
    }
  };

  useEffect(() => {
    setLocationState(prev => ({
      ...prev,
      showingAccuracyHelp: false
    }));
  }, [setLocationState]);

  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      const position = await getUserLocation();
      if (position) {
        const { latitude, longitude } = position;
        const addressResult = await getAddressFromCoordinates(latitude, longitude);
        handleGeocodeResult(addressResult, latitude, longitude);
      }
      
      if (usingMockData) {
        setIsLoading(false);
      }
    };
    
    initializeComponent();
    
    return () => {
      if (marker) marker.setMap(null);
      if (accuracyCircle) accuracyCircle.setMap(null);
    };
  }, [mapRetryCount]);

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center space-x-2 mb-4">
        <SearchBar onSearch={handleAddressSearch} />
        <Button 
          size="icon" 
          variant="outline" 
          onClick={handleLocationButtonClick}
          className="bg-orange-500/10 text-orange-500 border-orange-500/50 hover:bg-orange-500/20"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      <AlertMessages 
        locationPermissionDenied={locationState.locationPermissionDenied} 
        showingAccuracyHelp={locationState.showingAccuracyHelp}
        disableAccuracyWarnings={disableAccuracyWarnings}
      />
      
      <div className="relative flex-1 mb-4 rounded-xl overflow-hidden">
        <GoogleMap
          locationState={locationState}
          onMapClick={handleMapLocationUpdate}
          onMarkerDrag={handleMapLocationUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          usingMockData={usingMockData}
          setUsingMockData={setUsingMockData}
          setMap={setMap}
          setMarker={setMarker}
          setAccuracyCircle={setAccuracyCircle}
        />
        
        {usingMockData && selectedAddress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-black/70 rounded-xl max-w-[80%] z-10">
              <AddressInfoDisplay 
                loadingAddress={loadingAddress}
                selectedAddress={selectedAddress}
                usingMockData={true}
              />
            </div>
          </div>
        )}
        
        <MapOverlays 
          usingMockData={usingMockData} 
          isLoading={isLoading} 
          handleCurrentLocation={handleLocationButtonClick} 
          showAccuracyWarning={false}
        />
      </div>
      
      <div className="space-y-4">
        <AddressInfoDisplay 
          loadingAddress={loadingAddress}
          selectedAddress={selectedAddress}
          usingMockData={false}
        />
        
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
