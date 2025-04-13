
import React from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddressWithWeatherProps {
  deliveryTime: string;
  address: string;
  weatherTemperature: string;
  weatherDescription: string;
  onBackClick: () => void;
}

const AddressWithWeather: React.FC<AddressWithWeatherProps> = ({
  deliveryTime,
  address,
  weatherTemperature,
  weatherDescription,
  onBackClick,
}) => {
  const navigate = useNavigate();
  
  const handleAddressClick = () => {
    navigate("/address-selection");
  };
  
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between bg-black/70 backdrop-blur-sm px-4 py-3 z-20 relative"
    >
      <div className="flex items-center">
        <button
          onClick={onBackClick}
          className="mr-3"
        >
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-black/20 text-white">
            <ArrowLeft className="h-5 w-5" />
          </div>
        </button>
        
        <div className="cursor-pointer" onClick={handleAddressClick}>
          <div className="text-xs text-gray-400">{deliveryTime}</div>
          <div className="flex items-center text-sm font-medium text-white">
            <MapPin className="h-4 w-4 mr-1 text-zepmeds-purple" />
            <span className="mr-1 max-w-[180px] truncate">{address}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-white text-lg font-semibold">{weatherTemperature}</div>
        <div className="text-xs text-gray-400">{weatherDescription}</div>
      </div>
    </motion.div>
  );
};

export default AddressWithWeather;
