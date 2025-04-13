import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { X, Home, MapPin, Navigation, PlusCircle, Edit, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import MapAddressSelector from "@/components/address/MapAddressSelector";
import { 
  loadGoogleMapsAPI, 
  getCurrentPosition,
  reverseGeocode as getAddressFromCoordinates
} from "@/utils/googleMapsLoader";

interface Address {
  id: string;
  label: string;
  address: string;
  isSelected: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

const AddressSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [processingAddress, setProcessingAddress] = useState(false);
  const [userCurrentLocation, setUserCurrentLocation] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: 'Home',
    address: '',
    isSelected: false
  });
  const [mapplsReady, setMapplsReady] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [locationRetryCount, setLocationRetryCount] = useState(0);

  useEffect(() => {
    const setupMap = async () => {
      const initialized = await loadGoogleMapsAPI();
      setMapplsReady(!!initialized);
    };
    
    setupMap();
    
    const savedAddresses = localStorage.getItem("savedAddresses");
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (e) {
        console.error("Error parsing saved addresses:", e);
        setDefaultAddress();
      }
    } else {
      setDefaultAddress();
    }

    loadUserCurrentLocation();
  }, [locationRetryCount]);
  
  const setDefaultAddress = () => {
    const defaultAddress: Address = {
      id: "home-1",
      label: "Home",
      address: "Gurugram, Haryana, 122001",
      isSelected: true,
      city: "Gurugram",
      state: "Haryana",
      zipCode: "122001"
    };
    setAddresses([defaultAddress]);
    localStorage.setItem("savedAddresses", JSON.stringify([defaultAddress]));
  };

  const loadUserCurrentLocation = async () => {
    setUserCurrentLocation("Getting your location...");
    
    try {
      let bestPosition = null;
      let bestAccuracy = Infinity;
      
      for (let i = 0; i < 5; i++) {
        try {
          console.log(`Attempting to get user location, try ${i+1}`);
          const position = await getCurrentPosition();
          
          if (position.coords.accuracy < bestAccuracy) {
            bestPosition = position;
            bestAccuracy = position.coords.accuracy;
            console.log(`Got position with accuracy: ${bestAccuracy} meters`);
            
            if (bestAccuracy < 100) break;
          }
          
          if (i < 4) await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.warn(`Attempt ${i+1} failed:`, e);
        }
      }
      
      if (!bestPosition) {
        if (locationRetryCount < 1) {
          toast({
            title: "Location accuracy poor",
            description: "Trying again to get your location...",
          });
          setLocationRetryCount(prev => prev + 1);
          return;
        }
        throw new Error("Could not get accurate position");
      }
      
      const { latitude, longitude, accuracy } = bestPosition.coords;
      
      const roundedLat = parseFloat(latitude.toFixed(6));
      const roundedLng = parseFloat(longitude.toFixed(6));
      
      setCurrentCoordinates({ lat: roundedLat, lng: roundedLng });
      console.log("Current location coordinates:", roundedLat, roundedLng);
      console.log("Location accuracy:", accuracy, "meters");
      
      try {
        const addressData = await getAddressFromCoordinates(roundedLat, roundedLng);
        setUserCurrentLocation(addressData.formatted_address);
        console.log("Current location address:", addressData.formatted_address);
      } catch (error) {
        console.error("Error getting address:", error);
        setUserCurrentLocation(`Location at ${roundedLat.toFixed(4)}, ${roundedLng.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      setUserCurrentLocation("Location access denied");
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSelectAddress = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isSelected: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    
    toast({
      title: "Address Selected",
      description: "Your delivery address has been updated",
    });
    
    setTimeout(() => {
      navigate("/medicine-delivery");
    }, 500);
  };

  const handleUseCurrentLocation = async () => {
    if (!userCurrentLocation || userCurrentLocation.includes("denied") || userCurrentLocation.includes("not supported") || userCurrentLocation.includes("Getting")) {
      toast({
        title: "Location Unavailable",
        description: "Please enable location services and try again",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingAddress(true);
    
    try {
      let roundedLat, roundedLng;
      
      if (currentCoordinates) {
        roundedLat = currentCoordinates.lat;
        roundedLng = currentCoordinates.lng;
      } else {
        let bestPosition = null;
        let bestAccuracy = Infinity;
        
        for (let i = 0; i < 3; i++) {
          try {
            console.log(`Getting current location for use, attempt ${i+1}`);
            const position = await getCurrentPosition();
            
            if (position.coords.accuracy < bestAccuracy) {
              bestPosition = position;
              bestAccuracy = position.coords.accuracy;
              
              if (bestAccuracy < 100) break;
            }
            
            await new Promise(r => setTimeout(r, 300));
          } catch (e) {
            console.warn(`Attempt ${i+1} failed:`, e);
          }
        }
        
        if (!bestPosition) {
          throw new Error("Could not get accurate position for current location");
        }
        
        const { latitude, longitude } = bestPosition.coords;
        roundedLat = parseFloat(latitude.toFixed(6));
        roundedLng = parseFloat(longitude.toFixed(6));
      }
      
      console.log("Using current location:", roundedLat, roundedLng);
      
      try {
        const result = await getAddressFromCoordinates(roundedLat, roundedLng);
        processAddressResults(result, roundedLat, roundedLng);
      } catch (error) {
        console.error("Error getting address:", error);
        const fallbackAddress = {
          address_components: [
            { long_name: "Unknown Location", short_name: "Unknown Location", types: ["route"] },
            { long_name: "Unknown City", short_name: "Unknown City", types: ["locality"] },
            { long_name: "Unknown State", short_name: "Unknown", types: ["administrative_area_level_1"] },
            { long_name: "Unknown Country", short_name: "Unknown", types: ["country"] },
            { long_name: "000000", short_name: "000000", types: ["postal_code"] }
          ],
          formatted_address: `Location at ${roundedLat.toFixed(6)}, ${roundedLng.toFixed(6)}`,
          geometry: {
            location: {
              lat: () => roundedLat,
              lng: () => roundedLng
            }
          }
        };
        processAddressResults(fallbackAddress, roundedLat, roundedLng);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      toast({
        title: "Location Error",
        description: "Could not access your location. Please enable location services and try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAddress(false);
    }
  };
  
  const processAddressResults = (result: any, latitude: number, longitude: number) => {
    console.log("Processing address results:", result);
    const addressComponents = result.address_components;
    
    const city = addressComponents.find((c: any) => 
      c.types.includes("locality"))?.long_name || "Unknown City";
    const state = addressComponents.find((c: any) => 
      c.types.includes("administrative_area_level_1"))?.short_name || "Unknown State";
    const zipCode = addressComponents.find((c: any) => 
      c.types.includes("postal_code"))?.long_name || "000000";
    
    const newAddress: Address = {
      id: "current-location",
      label: "Current Location",
      address: result.formatted_address,
      isSelected: true,
      latitude,
      longitude,
      city,
      state,
      zipCode
    };
    
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isSelected: false
    }));
    
    const currentLocationIndex = updatedAddresses.findIndex(addr => addr.id === "current-location");
    
    if (currentLocationIndex >= 0) {
      updatedAddresses[currentLocationIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }
    
    setAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    
    toast({
      title: "Using Current Location",
      description: "Delivering to your current location",
    });
    
    setTimeout(() => {
      navigate("/medicine-delivery");
    }, 500);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      label: 'Home',
      address: '',
      isSelected: false
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      label: address.label,
      address: address.address,
      isSelected: address.isSelected,
      latitude: address.latitude,
      longitude: address.longitude,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    });
    setShowAddressModal(true);
  };

  const handleAddressSelected = (addressDetails: {
    fullAddress: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    console.log("Selected address from map:", addressDetails);
    setNewAddress({
      ...newAddress,
      address: addressDetails.fullAddress,
      latitude: addressDetails.latitude,
      longitude: addressDetails.longitude,
      city: addressDetails.city,
      state: addressDetails.state,
      zipCode: addressDetails.zipCode
    });
    
    setShowMapDialog(false);
    setShowAddressModal(true);
    
    toast({
      title: "Address Selected",
      description: "Location has been selected successfully",
    });
  };

  const openMapSelector = () => {
    setShowMapDialog(true);
    setShowAddressModal(false);
  };

  const saveAddress = () => {
    if (!newAddress.address) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive"
      });
      return;
    }
    
    if (editingAddress) {
      const updatedAddresses = addresses.map(addr => {
        if (addr.id === editingAddress.id) {
          return { 
            ...addr, 
            label: newAddress.label || 'Home',
            address: newAddress.address || '',
            isSelected: newAddress.isSelected || false,
            latitude: newAddress.latitude,
            longitude: newAddress.longitude,
            city: newAddress.city,
            state: newAddress.state,
            zipCode: newAddress.zipCode
          };
        }
        return newAddress.isSelected 
          ? { ...addr, isSelected: false } 
          : addr;
      });
      
      setAddresses(updatedAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
      
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
      });
    } else {
      const newId = Date.now().toString();
      const addressToAdd: Address = {
        id: newId,
        label: newAddress.label as string || 'Home',
        address: newAddress.address as string,
        isSelected: newAddress.isSelected as boolean,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode
      };
      
      let updatedAddresses;
      if (newAddress.isSelected) {
        updatedAddresses = addresses.map(addr => ({ 
          ...addr, 
          isSelected: false 
        }));
        updatedAddresses.push(addressToAdd);
      } else {
        updatedAddresses = [...addresses, addressToAdd];
      }
      
      setAddresses(updatedAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
      
      toast({
        title: "Address added",
        description: "Your new address has been added successfully.",
      });
    }
    
    setShowAddressModal(false);
  };

  const getAddressIcon = (type: string) => {
    if (type === 'Home' || type === 'home') {
      return <Home className="h-5 w-5 text-orange-500" />;
    } else if (type === 'Work' || type === 'work') {
      return <Briefcase className="h-5 w-5 text-green-500" />;
    } else {
      return <MapPin className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header showBackButton title="Select Location" />
      
      <main className="px-4 py-6">
        <div className="relative">
          <Input
            placeholder="Search for area, street name..."
            className="pl-10 py-6 bg-black/40 border-gray-700 rounded-xl text-white"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 py-6 justify-start border-gray-700 hover:bg-black/50 text-blue-400"
          onClick={handleUseCurrentLocation}
          disabled={processingAddress}
        >
          <div className="flex items-center w-full">
            <div className="mr-3 bg-blue-600/20 p-2 rounded-full">
              <Navigation className={`h-5 w-5 text-blue-400 ${processingAddress ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium">{processingAddress ? "Getting your location..." : "Use your current location"}</p>
              <p className="text-sm text-gray-400">
                {userCurrentLocation || "Fetching location..."}
              </p>
            </div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="w-full mt-4 py-6 justify-start border-gray-700 hover:bg-black/50 text-blue-400"
          onClick={handleAddNewAddress}
        >
          <div className="flex items-center">
            <div className="mr-3 bg-blue-600/20 p-2 rounded-full">
              <PlusCircle className="h-5 w-5 text-blue-400" />
            </div>
            <p className="font-medium">Add New Address</p>
          </div>
        </Button>
        
        <h2 className="mt-8 mb-4 text-xl font-semibold">Your saved addresses</h2>
        
        <div className="space-y-4">
          {addresses.map((address) => (
            <div 
              key={address.id}
              className="border border-gray-700 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center flex-1 cursor-pointer" onClick={() => handleSelectAddress(address.id)}>
                <div className="bg-gray-800 p-3 rounded-full mr-4">
                  {getAddressIcon(address.label)}
                </div>
                <div>
                  <h3 className="font-medium">{address.label}</h3>
                  <p className="text-sm text-gray-400">{address.address}</p>
                  {address.city && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {address.city && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                          {address.city}
                        </span>
                      )}
                      {address.state && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          {address.state} {address.zipCode && `- ${address.zipCode}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                {address.isSelected && (
                  <div className="bg-blue-600 text-white text-xs py-1 px-2 rounded-full">
                    Currently Selected
                  </div>
                )}
                <button 
                  className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-green-500/20 hover:text-green-400"
                  onClick={() => handleEditAddress(address)}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[600px] bg-black border-gray-700 text-white p-4 max-h-[90vh] overflow-auto">
          <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Address Type</label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={newAddress.label === 'Home' ? "default" : "outline"}
                  className={`flex-1 ${newAddress.label === 'Home' ? 'bg-orange-500' : 'border-gray-700'}`}
                  onClick={() => setNewAddress({...newAddress, label: 'Home'})}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button
                  type="button"
                  variant={newAddress.label === 'Work' ? "default" : "outline"}
                  className={`flex-1 ${newAddress.label === 'Work' ? 'bg-green-500' : 'border-gray-700'}`}
                  onClick={() => setNewAddress({...newAddress, label: 'Work'})}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Work
                </Button>
                <Button
                  type="button"
                  variant={newAddress.label === 'Other' ? "default" : "outline"}
                  className={`flex-1 ${newAddress.label === 'Other' ? 'bg-blue-500' : 'border-gray-700'}`}
                  onClick={() => setNewAddress({...newAddress, label: 'Other'})}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Other
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Full Address</label>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center text-xs h-7 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400 hover:text-blue-300"
                  onClick={openMapSelector}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Select on Map
                </Button>
              </div>
              <Input 
                placeholder="Enter your full address" 
                className="bg-black/20 border-gray-700"
                value={newAddress.address || ''} 
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
              />
            </div>
            
            {(newAddress.city || newAddress.state || newAddress.zipCode) && (
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">City</label>
                  <Input 
                    value={newAddress.city || ''} 
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="bg-black/20 border-gray-700 h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">State</label>
                  <Input 
                    value={newAddress.state || ''} 
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="bg-black/20 border-gray-700 h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">ZIP Code</label>
                  <Input 
                    value={newAddress.zipCode || ''} 
                    onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                    className="bg-black/20 border-gray-700 h-8 text-sm"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={`w-5 h-5 p-0 ${newAddress.isSelected ? 'bg-orange-500 border-none' : 'bg-black/20 border border-gray-700'}`}
                onClick={() => setNewAddress({...newAddress, isSelected: !newAddress.isSelected})}
              >
                {newAddress.isSelected && <Edit className="w-3 h-3 text-white" />}
              </Button>
              <span className="text-sm text-gray-400">Set as default address</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddressModal(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={saveAddress}
            >
              {editingAddress ? 'Update' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="bg-background border-gray-800 text-white max-w-xl p-0">
          <DialogTitle className="p-4 border-b border-gray-800">Select Location on Map</DialogTitle>
          
          <MapAddressSelector 
            onAddressSelected={handleAddressSelected}
            onCancel={() => {
              setShowMapDialog(false);
              setShowAddressModal(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSelection;
