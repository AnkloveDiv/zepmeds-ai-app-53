
import React from "react";

interface MedicineDetailsProps {
  name: string;
  description?: string;
  rating?: number;
  price: number;
  discountPrice?: number;
  manufacturer?: string;
  expiryDate?: string;
  saltComposition?: string;
  isLiquid?: boolean;
  volume?: string;
  quantity?: number;
}

const MedicineDetails: React.FC<MedicineDetailsProps> = ({ 
  name, 
  description,
  rating,
  price, 
  discountPrice, 
  manufacturer, 
  expiryDate,
  saltComposition,
  isLiquid = false,
  volume = "125 ML",
  quantity = 1
}) => {
  return (
    <div className="px-4 py-5 bg-black text-white">
      <h2 className="text-xl font-bold">{name}</h2>
      
      <div className="mt-2 text-gray-400">
        <p>{quantity} Bottle of {volume}</p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-gray-400 text-sm">Manufacturer</p>
          <p className="text-white mt-1">{manufacturer || "Galderma India Pvt Ltd"}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Salt composition</p>
          <p className="text-white mt-1">{saltComposition || "Not available"}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
