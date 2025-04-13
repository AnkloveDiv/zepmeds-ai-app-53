
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loadGoogleMapsAPI, getCurrentPosition, reverseGeocode, parseAddressComponents } from '@/utils/googleMapsLoader';
import { useNavigate } from 'react-router-dom';
import { AlertMessages } from './map/AlertMessages';
import { MapOverlays } from './map/MapOverlays';
import { AddressInfoDisplay } from './map/AddressInfoDisplay';
import { SearchBar } from './map/SearchBar';
import { toast } from 'sonner';
import { useMapLocation } from './map/useMapLocation';
import { useAddressSearch } from './map/useAddressSearch';

const MapAddressSelector = () => {
  const navigate = useNavigate();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  } = useMapLocation(map, marker, setError);

  const { 
    searchValue,
    setSearchValue,
    searchResults,
    isSearching,
    handleSearch,
    handleSearchResultClick
  } = useAddressSearch(map, marker, setLocation);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsAPI();
        
        // Create the map
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 20.5937, lng: 78.9629 }, // Default to India
          zoom: 5,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
        };
        
        const newMap = new google.maps.Map(mapElement, mapOptions);
        
        // Create the marker
        const newMarker = new google.maps.Marker({
          map: newMap,
          draggable: true,
          animation: google.maps.Animation.DROP,
        });
        
        // Add event listeners
        newMarker.addListener('dragend', async () => {
          const position = newMarker.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            setLocation({ lat, lng });
            
            try {
              const result = await reverseGeocode(lat, lng);
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
              console.error("Error reverse geocoding:", error);
              toast.error("Couldn't fetch address details. Please fill manually.");
            }
          }
        });
        
        setMap(newMap);
        setMarker(newMarker);
        setIsMapLoaded(true);
        
        // Try to get user's current location
        getMyLocation();
      } catch (error) {
        console.error("Error initializing map:", error);
        setError("Failed to load Google Maps. Please try again later.");
      }
    };
    
    initMap();
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
    
    // Save to localStorage (in a real app, this would be saved to a database)
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    addresses.push(addressObj);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    // Set as selected address
    localStorage.setItem('selectedAddress', JSON.stringify(addressObj));
    
    toast.success("Address saved successfully!");
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Container */}
      <div className="relative w-full h-1/2 min-h-[300px]">
        {error && <AlertMessages error={error} />}
        
        <div id="map" className="w-full h-full"></div>
        
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
      <Card className="flex-1 rounded-none border-0 shadow-none overflow-auto">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg font-semibold">Address Details</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House/Flat Number*</Label>
              <Input 
                id="houseNumber"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="e.g. 123, Flat 4B"
                required
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
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input 
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bangalore"
                required
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
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode*</Label>
              <Input 
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560034"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input 
                id="landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Park"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Address Type</Label>
            <div className="flex space-x-4">
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
        <CardFooter className="px-4 py-3 flex justify-end">
          <Button
            onClick={handleSaveAddress}
            disabled={!houseNumber || !streetName || !area || !city || !state || !pincode}
            className="w-full"
          >
            Save Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MapAddressSelector;
