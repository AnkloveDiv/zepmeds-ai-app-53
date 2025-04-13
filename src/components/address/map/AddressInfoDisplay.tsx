
import React from "react";
import { MapPin } from "lucide-react";
import { Loader } from "lucide-react";

interface AddressInfoDisplayProps {
  loadingAddress: boolean;
  selectedAddress: AddressDetails | null;
  usingMockData: boolean;
}

export interface AddressDetails {
  fullAddress: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
}

const AddressInfoDisplay: React.FC<AddressInfoDisplayProps> = ({ 
  loadingAddress, 
  selectedAddress,
  usingMockData
}) => {
  if (usingMockData && selectedAddress) {
    return (
      <div className="text-sm bg-gray-700/50 p-2 rounded">
        <p className="text-blue-400">{selectedAddress.fullAddress}</p>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            {selectedAddress.city}
          </span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
            {selectedAddress.state}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-4">
      <label className="text-gray-400 text-sm">Selected Address</label>
      {loadingAddress ? (
        <div className="flex items-center gap-2 text-gray-400 mt-2">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Getting address...</span>
        </div>
      ) : selectedAddress ? (
        <div className="mt-1">
          <p className="text-white">{selectedAddress.fullAddress}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              {selectedAddress.city}
            </div>
            <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              {selectedAddress.state}
            </div>
            <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
              {selectedAddress.zipCode}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Coordinates: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No address selected</p>
      )}
    </div>
  );
};

export default AddressInfoDisplay;
