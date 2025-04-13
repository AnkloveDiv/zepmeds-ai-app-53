
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import WeatherForecast from './WeatherForecast';

interface AddressWithWeatherProps {
  deliveryTime?: string;
  address?: string;
}

const AddressWithWeather: React.FC<AddressWithWeatherProps> = ({ 
  deliveryTime = "11 minutes delivery", 
  address = "to Home Ghh, Bnn, Gurugram, 122001" 
}) => {
  return (
    <div className="w-full bg-[#5d6c92]/70 backdrop-blur-md px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold">{deliveryTime}</h1>
            <div className="flex items-center">
              <p className="text-white text-sm">{address}</p>
              <ChevronDown className="w-4 h-4 text-white ml-1" />
            </div>
          </div>
        </div>
        
        <WeatherForecast />
      </div>
    </div>
  );
};

export default AddressWithWeather;
