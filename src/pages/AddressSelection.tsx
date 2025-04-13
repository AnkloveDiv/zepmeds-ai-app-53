
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { X, Home, MapPin, Navigation, PlusCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MapAddressSelector from "@/components/address/MapAddressSelector";

interface Address {
  id: string;
  label: string;
  address: string;
  isSelected: boolean;
}

const AddressSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userCurrentLocation, setUserCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    // Load saved addresses from localStorage
    const savedAddresses = localStorage.getItem("savedAddresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // If no addresses exist, create a default one
      const defaultAddress: Address = {
        id: "home-1",
        label: "Home",
        address: "Ghh, Bnn, Gurugram, 122001",
        isSelected: true
      };
      setAddresses([defaultAddress]);
      localStorage.setItem("savedAddresses", JSON.stringify([defaultAddress]));
    }

    // Try to get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demonstration, show coordinates
          // In a real app, you would use reverse geocoding to get the address
          const { latitude, longitude } = position.coords;
          setUserCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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
    if (!userCurrentLocation || userCurrentLocation.includes("denied") || userCurrentLocation.includes("not supported")) {
      toast({
        title: "Location Unavailable",
        description: "Please enable location services and try again",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we already have a current location address
    const currentLocationAddress = addresses.find(addr => addr.id === "current-location");
    
    if (currentLocationAddress) {
      handleSelectAddress("current-location");
    } else {
      // Create a new address with the current location
      const newAddress: Address = {
        id: "current-location",
        label: "Current Location",
        address: `Latitude/Longitude: ${userCurrentLocation}`,
        isSelected: true
      };
      
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isSelected: false
      }));
      
      const newAddresses = [...updatedAddresses, newAddress];
      setAddresses(newAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(newAddresses));
      
      toast({
        title: "Using Current Location",
        description: "Delivering to your current location",
      });
      
      setTimeout(() => {
        navigate("/medicine-delivery");
      }, 500);
    }
  };

  const handleAddNewAddress = () => {
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
    const newAddress: Address = {
      id: `address-${Date.now()}`,
      label: "Home",
      address: addressDetails.fullAddress,
      isSelected: true
    };
    
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isSelected: false
    }));
    
    const newAddresses = [...updatedAddresses, newAddress];
    setAddresses(newAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(newAddresses));
    
    setShowAddressModal(false);
    
    toast({
      title: "Address Added",
      description: "Your new delivery address has been saved",
    });
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
              onClick={() => handleSelectAddress(address.id)}
            >
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-full mr-4">
                  <Home className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium">{address.label}</h3>
                  <p className="text-sm text-gray-400">{address.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {address.isSelected && (
                  <div className="bg-blue-600 text-white text-xs py-1 px-2 rounded-full">
                    Currently Selected
                  </div>
                )}
                <button className="p-2 bg-gray-800 rounded-full">
                  <Edit className="h-4 w-4 text-gray-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[600px] bg-black border-gray-700 text-white p-0 max-h-[90vh] overflow-auto">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Add New Address</h2>
          </div>
          <MapAddressSelector 
            onAddressSelected={handleAddressSelected}
            onCancel={() => setShowAddressModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSelection;
