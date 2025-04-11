
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
import { MapPin, Home, Briefcase, Plus, Edit, Trash2, Check } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  isDefault: boolean;
}

const ManageAddresses = () => {
  useBackNavigation();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      address: '456 Office Plaza, Suite 200, New York, NY 10002',
      isDefault: false
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
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
      isDefault: address.isDefault
    });
    setShowAddDialog(true);
  };
  
  const openAddNewDialog = () => {
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      address: '',
      isDefault: false
    });
    setShowAddDialog(true);
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
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...newAddress as Address } 
          : newAddress.isDefault 
            ? { ...addr, isDefault: false } 
            : addr
      ));
      
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
        isDefault: newAddress.isDefault as boolean
      };
      
      // If this is set as default, update all others to not be default
      if (newAddress.isDefault) {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: false })).concat(addressToAdd));
      } else {
        setAddresses([...addresses, addressToAdd]);
      }
      
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
            className="w-full flex items-center justify-center gap-2 bg-zepmeds-purple hover:bg-zepmeds-purple/90"
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
                    <Home className="h-5 w-5 text-zepmeds-purple" />
                  ) : address.type === 'work' ? (
                    <Briefcase className="h-5 w-5 text-zepmeds-purple" />
                  ) : (
                    <MapPin className="h-5 w-5 text-zepmeds-purple" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium capitalize">{address.type}</h3>
                      <p className="text-gray-400 text-sm mt-1">{address.address}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 rounded-full bg-black/20 text-gray-400 hover:text-white"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 rounded-full bg-black/20 text-gray-400 hover:text-red-500"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    {address.isDefault ? (
                      <span className="text-xs bg-zepmeds-purple/20 text-zepmeds-purple px-2 py-1 rounded-full">
                        Default Address
                      </span>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-zepmeds-purple hover:bg-zepmeds-purple/10"
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
              <label className="text-sm text-gray-400">Full Address</label>
              <Input 
                placeholder="Enter your full address" 
                className="bg-black/20 border-gray-700"
                value={newAddress.address} 
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div 
                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${
                  newAddress.isDefault ? 'bg-zepmeds-purple' : 'bg-black/20 border border-gray-700'
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
            >
              Cancel
            </Button>
            <Button 
              className="bg-zepmeds-purple hover:bg-zepmeds-purple/90"
              onClick={saveAddress}
            >
              {editingAddress ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default ManageAddresses;
