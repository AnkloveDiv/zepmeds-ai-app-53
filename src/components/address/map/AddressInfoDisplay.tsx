
import React from 'react';
import { Location } from './useMapLocation';

interface AddressInfoDisplayProps {
  location: Location;
}

const AddressInfoDisplay: React.FC<AddressInfoDisplayProps> = ({ location }) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-md text-xs max-w-[50%]">
      <p className="font-medium">Selected Location</p>
      <p className="mt-1 text-gray-300">
        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
      </p>
    </div>
  );
};

export default AddressInfoDisplay;
