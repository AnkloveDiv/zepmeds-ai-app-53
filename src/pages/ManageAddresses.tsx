
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Briefcase, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  isDefault: boolean;
}

const ManageAddresses = () => {
  useBackNavigation();
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

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
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
          <Button className="w-full flex items-center justify-center gap-2 bg-zepmeds-purple hover:bg-zepmeds-purple/90">
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
                      <button className="p-2 rounded-full bg-black/20 text-gray-400 hover:text-white">
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
      
      <BottomNavigation />
    </div>
  );
};

export default ManageAddresses;
