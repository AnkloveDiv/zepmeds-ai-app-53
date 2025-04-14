
import React from "react";
import { X } from "lucide-react";

interface MedicineHeaderProps {
  medicine: {
    name: string;
    image: string;
    price: number;
    discountPrice?: number;
    rating: number;
    description?: string;
  };
  discount: number;
  onClose: () => void;
}

const MedicineHeader: React.FC<MedicineHeaderProps> = ({ medicine, discount, onClose }) => {
  return (
    <>
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          <img 
            src={medicine.image} 
            alt={medicine.name} 
            className="w-full h-full object-contain p-4"
          />
        </div>
        
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        
        <button 
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="px-4 py-3 bg-gray-900/30">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{medicine.name}</h2>
            <p className="text-gray-400 text-sm">{medicine.description}</p>
          </div>
          
          <div className="flex items-center bg-amber-500/20 px-2 py-1 rounded-full">
            <span className="text-amber-400 mr-1">★</span>
            <span className="text-white text-sm">{medicine.rating}</span>
          </div>
        </div>
        
        <div className="flex items-baseline mt-2">
          {medicine.discountPrice ? (
            <>
              <span className="text-blue-400 text-xl font-bold mr-2">₹{medicine.discountPrice}</span>
              <span className="text-gray-400 text-sm line-through">₹{medicine.price}</span>
            </>
          ) : (
            <span className="text-blue-400 text-xl font-bold">₹{medicine.price}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default MedicineHeader;
