
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { X, Home, MapPin, Navigation, PlusCircle, Edit, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import MapAddressSelector from "@/components/address/MapAddressSelector";
import { initializeGoogleMaps, mockGeocodeResponse } from "@/utils/googleMapsLoader";

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
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  useEffect(() => {
    // Initialize Google Maps API
    const setupGoogleMaps = async () => {
      const initialized = await initializeGoogleMaps();
      setGoogleMapsReady(initialized);
    };
    
    setupGoogleMaps();
    
    // Load saved addresses from localStorage
    const savedAddresses = localStorage.getItem("savedAddresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // If no addresses exist, create a default one
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
    }

    // Try to get current location
    if (navigator.geolocation) {
      setUserCurrentLocation("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location coordinates:", latitude, longitude);
          
          // Use the geocoding API to get the address from coordinates
          if (window.google && window.google.maps) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                setUserCurrentLocation(results[0].formatted_address);
                console.log("Current location address:", results[0].formatted_address);
              } else {
                // Use mock data when geocoding fails
                const mockResult = mockGeocodeResponse(latitude, longitude);
                setUserCurrentLocation(mockResult.formatted_address);
              }
            });
          } else {
            // If Google Maps API is not available, use the mock data
            const mockResult = mockGeocodeResponse(latitude, longitude);
            setUserCurrentLocation(mockResult.formatted_address);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          setUserCurrentLocation("Location access denied");
        }
      );
    } else {
      setUserCurrentLocation("Geolocation not supported by this browser");
    }
  }, []);

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

  const handleUseCurrentLocation = () => {
    if (!userCurrentLocation || userCurrentLocation.includes("denied") || userCurrentLocation.includes("not supported") || userCurrentLocation.includes("Getting")) {
      toast({
        title: "Location Unavailable",
        description: "Please enable location services and try again",
        variant: "destructive",
      });
      return;
    }
    
    // Get the actual coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use geocoding to get the address
          let city = "Gurugram";
          let state = "Haryana";
          let zipCode = "122001";
          let formattedAddress = userCurrentLocation;
          
          if (window.google && window.google.maps) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                processAddressResults(results[0], latitude, longitude);
              } else {
                // Use mock data when geocoding fails
                const mockResult = mockGeocodeResponse(latitude, longitude);
                processAddressResults(mockResult, latitude, longitude);
              }
            });
          } else {
            // If Google Maps API is not available, use the mock data
            const mockResult = mockGeocodeResponse(latitude, longitude);
            processAddressResults(mockResult, latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enable location services and try again.",
            variant: "destructive",
          });
        }
      );
    }
  };
  
  const processAddressResults = (result: any, latitude: number, longitude: number) => {
    const addressComponents = result.address_components;
    
    // Extract address components
    const city = addressComponents.find((c: any) => 
      c.types.includes("locality"))?.long_name || "Gurugram";
    const state = addressComponents.find((c: any) => 
      c.types.includes("administrative_area_level_1"))?.short_name || "HR";
    const zipCode = addressComponents.find((c: any) => 
      c.types.includes("postal_code"))?.long_name || "122001";
    
    // Create a new address with the current location
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
    
    // Check if we already have a current location address to update
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
      // Update existing address
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
        // If current address is being set as default, set all others to non-default
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
      // Add new address
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
      // If this is set as default, update all others to not be default
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
        >
          <div className="flex items-center">
            <div className="mr-3 bg-blue-600/20 p-2 rounded-full">
              <Navigation className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Use your current location</p>
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
