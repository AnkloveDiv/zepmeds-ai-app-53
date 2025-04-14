
import React from "react";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { detectMedicineType } from "../utils/detectMedicineType";

interface MedicineQuantityProps {
  medicine: {
    name: string;
    price: number;
    discountPrice?: number;
    inStock?: boolean;
  };
  quantity: number;
  strips?: number;
  handleIncrementQuantity: (e: React.MouseEvent) => void;
  handleDecrementQuantity: (e: React.MouseEvent) => void;
  handleAddToCart: () => void;
  animateQuantity?: boolean;
}

const MedicineQuantity: React.FC<MedicineQuantityProps> = ({
  medicine,
  quantity,
  handleIncrementQuantity,
  handleDecrementQuantity,
  handleAddToCart,
  animateQuantity
}) => {
  const medicineType = detectMedicineType(medicine.name);
  const isLiquid = medicineType === "liquid";
  
  // Default inStock to true if not specified
  const inStock = medicine.inStock !== undefined ? medicine.inStock : true;
  
  // Calculate the display price
  const displayPrice = medicine.discountPrice || medicine.price;
  const formattedPrice = displayPrice.toFixed(2);

  // Calculate the cart price
  const cartTotalItems = 2; // Mock data
  const cartTotalPrice = 675.55; // Mock data

  return (
    <div className="bg-black px-4 py-3 border-t border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white text-sm">
          <div className="flex items-center">
            <span className="bg-red-500 text-white text-xs px-1 mr-2">2x</span>
            <span>{cartTotalItems} items</span>
          </div>
          <div className="text-white">₹ {cartTotalPrice}</div>
        </div>
        
        <button 
          className="bg-indigo-600 text-white py-2 px-6 rounded-md"
          onClick={handleAddToCart}
        >
          View Cart
        </button>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-800">
        <div>
          <div className="text-gray-400 text-sm">
            {quantity} Bottle of {isLiquid ? "125 ML" : ""}
          </div>
          <div className="text-white text-xl font-bold">
            ₹ {formattedPrice}
          </div>
        </div>
        
        <div className="flex items-center">
          <motion.button 
            className="w-9 h-9 rounded-md bg-indigo-600 text-white flex items-center justify-center"
            onClick={handleDecrementQuantity}
            whileTap={{ scale: 0.9 }}
            disabled={quantity <= 1}
          >
            <Minus className="h-5 w-5" />
          </motion.button>
          
          <span className="w-10 text-center text-white text-lg font-semibold">
            {quantity}
          </span>
          
          <motion.button 
            className="w-9 h-9 rounded-md bg-indigo-600 text-white flex items-center justify-center"
            onClick={handleIncrementQuantity}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MedicineQuantity;
