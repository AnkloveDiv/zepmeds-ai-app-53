
import React from "react";
import { MapPin, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Address } from "@/services/addressService";

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddress: string | null;
  setSelectedAddress: (id: string) => void;
  onAddNewAddress: () => void;
}

const AddressSelection = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  onAddNewAddress,
}: AddressSelectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <MapPin className="mr-2 text-blue-400" size={20} />
        Delivery Address
      </h2>
      
      {addresses.length > 0 ? (
        <RadioGroup 
          value={selectedAddress || ""} 
          onValueChange={(value) => setSelectedAddress(value)}
          className="space-y-3"
        >
          {addresses.map(address => (
            <div 
              key={address.id}
              className={`p-4 rounded-xl transition-all ${
                selectedAddress === address.id 
                  ? "border-blue-500 glass-morphism shadow-md" 
                  : "border-gray-700 bg-black/40"
              }`}
              onClick={() => setSelectedAddress(address.id)}
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <RadioGroupItem 
                      value={address.id} 
                      id={`address-${address.id}`} 
                      className="text-blue-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-white font-medium">{address.address}</h3>
                      {address.is_default && (
                        <Badge variant="outline" className="ml-2 text-xs px-2 py-0 h-5 bg-green-900/30 text-green-400 border-green-800">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{address.city}, {address.state} {address.zipcode}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400 mb-2">No addresses found</p>
          <Button 
            variant="outline" 
            className="text-blue-400 border-blue-800"
            onClick={onAddNewAddress}
          >
            Add New Address
          </Button>
        </div>
      )}
      
      {addresses.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 text-blue-400 border-blue-800 hover:bg-blue-900/30"
          onClick={onAddNewAddress}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}
    </div>
  );
};

export default AddressSelection;
