
import React from "react";
import { X, Share2 } from "lucide-react";
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
    <div className="relative bg-white rounded-t-xl pt-10 pb-4">
      <button 
        className="absolute top-4 left-4 text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      
      <button className="absolute top-4 right-4 text-black">
        <Share2 size={20} />
      </button>
      
      <div className="w-full h-48 flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className="h-full object-contain"
        />
      </div>
      
      {/* Image pagination dots */}
      <div className="flex justify-center gap-1 mt-4">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicineImage;
