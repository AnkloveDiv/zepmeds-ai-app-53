
import React from 'react';
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import MedicineHeader from "./MedicineHeader";
import TabSelector from "./TabSelector";
import TabContent from "./TabContent";
import QuantitySelector from "./QuantitySelector";
import ActionButtons from "./ActionButtons";

interface MedicineDetailContentProps {
  medicine: {
    id: string;
    name: string;
    image: string;
    price: number;
    discountPrice?: number;
    rating: number;
    description?: string;
    fullDescription?: string;
    manufacturer?: string;
    expiryDate?: string;
    dosage?: string;
    sideEffects?: string[];
    ingredients?: string[];
    saltComposition?: string;
    howItWorks?: string;
    directions?: string;
    quickTips?: string[];
    faqs?: { question: string; answer: string }[];
    category?: string;
    inStock?: boolean;
  };
  onClose: () => void;
  onAddToCart: (quantity: number, strips: number) => void;
}

const MedicineDetailContent: React.FC<MedicineDetailContentProps> = ({
  medicine,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [strips, setStrips] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("description");

  const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    if (current > 1) {
      setter(current - 1);
    }
  };

  const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    setter(current + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, strips);
  };

  const discount = medicine.discountPrice 
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100) 
    : 0;

  const isLiquid = medicine.name.toLowerCase().includes("solution") || 
                  medicine.name.toLowerCase().includes("gel") || 
                  medicine.name.toLowerCase().includes("drops") ||
                  medicine.name.toLowerCase().includes("cream") ||
                  medicine.name.toLowerCase().includes("lotion");
                  
  const isDevice = medicine.name.toLowerCase().includes("monitor") || 
                  medicine.name.toLowerCase().includes("thermometer") ||
                  medicine.name.toLowerCase().includes("glasses");

  // Default inStock to true if not specified
  const inStock = medicine.inStock !== undefined ? medicine.inStock : true;

  return (
    <motion.div
      className="bg-[#1a1a2e] border border-gray-800 rounded-xl w-full max-w-md mx-auto overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      style={{ maxHeight: '90vh' }}
    >
      <div className="flex flex-col h-full">
        <MedicineHeader 
          medicine={medicine} 
          discount={discount} 
          onClose={onClose} 
        />
        
        <div className="px-4 sm:px-5 pt-0 pb-4 flex-1 overflow-auto">
          {!inStock && (
            <div className="mb-4 bg-red-900/30 border border-red-800 rounded-md p-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-300 text-sm">Not in stock right now, we will notify you</p>
            </div>
          )}
          
          <TabSelector 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-black/30 overflow-y-auto">
            <TabContent 
              activeTab={activeTab} 
              medicine={medicine} 
            />
          </div>
          
          <div className="border-t border-gray-700 my-5"></div>
          
          <QuantitySelector 
            quantity={quantity}
            setQuantity={setQuantity}
            strips={strips}
            setStrips={setStrips}
            isLiquid={isLiquid}
            isDevice={isDevice}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            disabled={!inStock}
          />
          
          <ActionButtons 
            onClose={onClose} 
            handleAddToCart={handleAddToCart}
            disabled={!inStock}
            inStock={inStock}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineDetailContent;
