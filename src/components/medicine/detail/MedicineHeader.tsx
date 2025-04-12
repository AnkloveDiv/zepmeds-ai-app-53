
import React from "react";
import { Star, Factory, Clock, Truck, ShieldCheck, X } from "lucide-react";

interface MedicineHeaderProps {
  medicine: {
    name: string;
    image: string;
    price: number;
    discountPrice?: number;
    rating: number;
    description?: string;
    manufacturer?: string;
    expiryDate?: string;
  };
  discount: number;
  onClose: () => void;
}

const MedicineHeader: React.FC<MedicineHeaderProps> = ({ medicine, discount, onClose }) => {
  return (
    <>
      <div className="relative">
        <img 
          src={medicine.image} 
          alt={medicine.name} 
          className="w-full h-48 object-cover rounded-t-xl"
        />
        
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            {discount}% OFF
          </div>
        )}
        
        <button 
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-white">{medicine.name}</h2>
          <div className="flex items-center bg-zepmeds-purple/20 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-xs text-white">{medicine.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{medicine.description}</p>
        
        <div className="flex items-baseline mb-4">
          {medicine.discountPrice ? (
            <>
              <span className="text-zepmeds-purple text-xl font-bold mr-2">₹{medicine.discountPrice}</span>
              <span className="text-gray-400 text-sm line-through">₹{medicine.price}</span>
            </>
          ) : (
            <span className="text-zepmeds-purple text-xl font-bold">₹{medicine.price}</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-zepmeds-purple" />
            <span className="text-sm text-gray-300">
              {medicine.manufacturer || "Zepmeds"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zepmeds-purple" />
            <span className="text-sm text-gray-300">
              {medicine.expiryDate || "12 months validity"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-zepmeds-purple" />
            <span className="text-sm text-gray-300">
              Free Delivery
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-zepmeds-purple" />
            <span className="text-sm text-gray-300">
              100% Genuine
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineHeader;
