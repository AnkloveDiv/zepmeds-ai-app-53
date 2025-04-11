
import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Home, Briefcase, Plus, Edit, Trash2, Check, Map, Loader2 } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import MapAddressSelector from "@/components/address/MapAddressSelector";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

const ManageAddresses = () => {
  useBackNavigation();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      isDefault: true,
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    {
      id: '2',
      type: 'work',
      address: '456 Office Plaza, Suite 200, New York, NY 10002',
      isDefault: false,
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [processingAddress, setProcessingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    address: '',
    isDefault: false
  });

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    
    toast({
      title: "Address deleted",
      description: "Your address has been removed successfully.",
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    
    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully.",
    });
  };
  
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      type: address.type,
      address: address.address,
      isDefault: address.isDefault,
      latitude: address.latitude,
      longitude: address.longitude,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    });
    setShowAddDialog(true);
  };
  
  const openAddNewDialog = () => {
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      address: '',
      isDefault: addresses.length === 0 // Set as default if this is the first address
    });
    setShowAddDialog(true);
  };
  
  const openMapSelector = () => {
    setShowMapDialog(true);
    setShowAddDialog(false);
  };
  
  const handleAddressSelected = (addressDetails: any) => {
    setProcessingAddress(true);
    
    // Simulate processing the address data
    setTimeout(() => {
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
      setShowAddDialog(true);
      setProcessingAddress(false);
      
      toast({
        title: "Location selected",
        description: "Address details have been retrieved successfully.",
      });
    }, 1500);
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
            ...newAddress as Address 
          };
        }
        // If current address is being set as default, set all others to non-default
        return newAddress.isDefault 
          ? { ...addr, isDefault: false } 
          : addr;
      });
      
      setAddresses(updatedAddresses);
      
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
      });
    } else {
      // Add new address
      const newId = Date.now().toString();
      const addressToAdd = {
        id: newId,
        type: newAddress.type as 'home' | 'work' | 'other',
        address: newAddress.address as string,
        isDefault: newAddress.isDefault as boolean,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode
      };
      
      let updatedAddresses;
      // If this is set as default, update all others to not be default
      if (newAddress.isDefault) {
        updatedAddresses = addresses.map(addr => ({ 
          ...addr, 
          isDefault: false 
        }));
        updatedAddresses.push(addressToAdd);
      } else {
        updatedAddresses = [...addresses, addressToAdd];
      }
      
      setAddresses(updatedAddresses);
      
      toast({
        title: "Address added",
        description: "Your new address has been added successfully.",
      });
    }
    
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Manage Addresses" />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:bg-orange-600"
            onClick={openAddNewDialog}
          >
            <Plus className="h-5 w-5" />
            <span>Add New Address</span>
          </Button>
        </motion.div>
        
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="glass-morphism rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-zepmeds-purple/20 flex items-center justify-center flex-shrink-0">
                  {address.type === 'home' ? (
                    <Home className="h-5 w-5 text-orange-500" />
                  ) : address.type === 'work' ? (
                    <Briefcase className="h-5 w-5 text-green-500" />
                  ) : (
                    <MapPin className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium capitalize">{address.type}</h3>
                      <p className="text-gray-400 text-sm mt-1">{address.address}</p>
                      {address.city && address.state && (
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                            {address.city}
                          </span>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                            {address.state} {address.zipCode}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-green-500/20 hover:text-green-400"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 rounded-full bg-black/20 text-gray-400 hover:bg-red-500/20 hover:text-red-500"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    {address.isDefault ? (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Default Address
                      </span>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-orange-500 hover:bg-orange-500/10"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-background border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Address Type</label>
              <Select 
                value={newAddress.type} 
                onValueChange={(value: any) => setNewAddress({...newAddress, type: value})}
              >
                <SelectTrigger className="bg-black/20 border-gray-700">
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                  <Map className="h-3 w-3 mr-1" />
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
              <div 
                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                  newAddress.isDefault ? 'bg-orange-500' : 'bg-black/20 border border-gray-700'
                }`}
                onClick={() => setNewAddress({...newAddress, isDefault: !newAddress.isDefault})}
              >
                {newAddress.isDefault && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm text-gray-400">Set as default address</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="bg-background border-gray-800 text-white max-w-xl" showClose={false}>
          <DialogHeader>
            <DialogTitle>Select Location on Map</DialogTitle>
          </DialogHeader>
          
          {processingAddress ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-white">Processing Address</h3>
              <p className="text-gray-400">Please wait while we process your location...</p>
            </div>
          ) : (
            <MapAddressSelector 
              onAddressSelected={handleAddressSelected}
              onCancel={() => {
                setShowMapDialog(false);
                setShowAddDialog(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default ManageAddresses;
