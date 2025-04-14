
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface MedicineImageProps {
  image: string;
  name: string;
  discount?: number;
  onClose: () => void;
}

const MedicineImage: React.FC<MedicineImageProps> = ({ 
  image, 
  name, 
  discount, 
  onClose 
}) => {
  return (
    <div className="relative">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-52 object-contain bg-gradient-to-r from-gray-800 to-gray-900 p-4"
      />
      
      {discount && discount > 0 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {discount}% OFF
        </div>
      )}
      
      <button 
        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
        onClick={onClose}
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default MedicineImage;
