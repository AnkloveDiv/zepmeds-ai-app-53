
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AlertMessages from './map/AlertMessages';
import MapOverlays from './map/MapOverlays';
import AddressInfoDisplay from './map/AddressInfoDisplay';
import SearchBar from './map/SearchBar';
import { useMapLocation } from './map/useMapLocation';
import { useAddressSearch } from './map/useAddressSearch';
import { 
  initializeMap, 
  reverseGeocode, 
  parseAddressComponents, 
  getMapLoadError,
  getCoordinatesFromClick
} from '@/utils/openLayersLoader';

// Import OpenLayers CSS
import 'ol/ol.css';
import { Map } from 'ol';

interface MapAddressSelectorProps {
  onAddressSelected?: (addressDetails: {
    fullAddress: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
  onCancel?: () => void;
}

const MapAddressSelector: React.FC<MapAddressSelectorProps> = ({ 
  onAddressSelected,
  onCancel
}) => {
  const navigate = useNavigate();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Form state
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('home');

  const { 
    location, 
    setLocation,
    isGettingLocation,
    getMyLocation 
  } = useMapLocation(map, setError);

  const { 
    searchValue,
    setSearchValue,
    searchResults,
    isSearching,
    handleSearch,
    handleSearchResultClick
  } = useAddressSearch(map, setLocation);

  // Initialize OpenLayers Map
  useEffect(() => {
    if (!mapRef.current) return;
    
    try {
      const newMap = initializeMap(mapRef.current);
      
      // Check if there's a map loading error
      const mapError = getMapLoadError();
      if (mapError) {
        setError(mapError);
        return;
      }
      
      // Set up click handler to update location when map is clicked
      newMap.on('click', (event) => {
        try {
          // Use the getCoordinatesFromClick helper function
          const newLocation = getCoordinatesFromClick(newMap, event);
          setLocation(newLocation);
          
          // Get address information
          reverseGeocode(newLocation.lat, newLocation.lng)
            .then(result => {
              if (result && result.address_components) {
                const addressData = parseAddressComponents(result.address_components);
                
                setHouseNumber(addressData.street_number);
                setStreetName(addressData.route);
                setArea(addressData.locality);
                setCity(addressData.city);
                setState(addressData.state);
                setPincode(addressData.postal_code);
              }
            })
            .catch(error => {
              console.error("Error reverse geocoding:", error);
              toast.error("Couldn't fetch address details. Please fill manually.");
            });
        } catch (err) {
          console.error("Error handling map click:", err);
        }
      });
      
      setMap(newMap);
      setIsMapLoaded(true);
      
      // Try to get user's current location
      getMyLocation();
    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to load map. Please check your internet connection.");
    }
  }, []);

  // Update address fields when location changes
  useEffect(() => {
    const updateAddressFields = async () => {
      if (!location || !isMapLoaded) return;
      
      try {
        const result = await reverseGeocode(location.lat, location.lng);
        if (result && result.address_components) {
          const addressData = parseAddressComponents(result.address_components);
          
          setHouseNumber(addressData.street_number);
          setStreetName(addressData.route);
          setArea(addressData.locality);
          setCity(addressData.city);
          setState(addressData.state);
          setPincode(addressData.postal_code);
        }
      } catch (error) {
        console.error("Error updating address fields:", error);
      }
    };
    
    updateAddressFields();
  }, [location, isMapLoaded]);

  const handleSaveAddress = () => {
    // Create the full address object
    const addressObj = {
      houseNumber,
      streetName,
      area,
      city,
      state,
      pincode,
      landmark,
      type: addressType,
      coords: location,
    };
    
    // If using as a component with callback
    if (onAddressSelected && location) {
      onAddressSelected({
        fullAddress: `${houseNumber} ${streetName}, ${area}, ${city}, ${state} ${pincode}`,
        latitude: location.lat,
        longitude: location.lng,
        city,
        state,
        zipCode: pincode
      });
      return;
    }
    
    // Otherwise, save to localStorage (in a real app, this would be saved to a database)
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    addresses.push(addressObj);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    // Set as selected address
    localStorage.setItem('selectedAddress', JSON.stringify(addressObj));
    
    toast.success("Address saved successfully!");
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      {/* Map Container */}
      <div className="relative flex-shrink-0 w-full h-2/5 min-h-[200px]">
        {error && <AlertMessages error={error} />}
        
        <div ref={mapRef} className="w-full h-full"></div>
        
        <MapOverlays 
          isGettingLocation={isGettingLocation}
          getMyLocation={getMyLocation}
        />
        
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-10">
          <SearchBar 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchResults={searchResults}
            isSearching={isSearching}
            handleSearch={handleSearch}
            handleSearchResultClick={handleSearchResultClick}
          />
        </div>
        
        {location && (
          <AddressInfoDisplay
            location={location}
          />
        )}
      </div>
      
      {/* Address Form */}
      <div className="flex-grow overflow-auto">
        <Card className="border-0 shadow-none rounded-none h-full">
          <CardHeader className="sticky top-0 bg-black z-10 px-4 py-3">
            <CardTitle className="text-lg font-semibold">Address Details</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 space-y-4 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="houseNumber">House/Flat Number*</Label>
                <Input 
                  id="houseNumber"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="e.g. 123, Flat 4B"
                  required
                  className="bg-black/20 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streetName">Street Name*</Label>
                <Input 
                  id="streetName"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Main Street"
                  required
                  className="bg-black/20 border-gray-700"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area/Locality*</Label>
              <Input 
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Koramangala"
                required
                className="bg-black/20 border-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input 
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore"
                  required
                  className="bg-black/20 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input 
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  required
                  className="bg-black/20 border-gray-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode*</Label>
                <Input 
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560034"
                  required
                  className="bg-black/20 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input 
                  id="landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Park"
                  className="bg-black/20 border-gray-700"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Address Type</Label>
              <div className="flex flex-wrap gap-2">
                {['home', 'work', 'other'].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={addressType === type ? "default" : "outline"}
                    onClick={() => setAddressType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 flex justify-end gap-3 sticky bottom-0 bg-black border-t border-gray-800 z-10">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSaveAddress}
              disabled={!houseNumber || !streetName || !area || !city || !state || !pincode}
              className={onCancel ? "flex-1" : "w-full"}
            >
              {onAddressSelected ? "Select Location" : "Save Address"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MapAddressSelector;
