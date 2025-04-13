
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { AlertTriangle, Building, Calendar, Truck, ShieldCheck } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [strips, setStrips] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [medicineType, setMedicineType] = useState<"tablets" | "liquid" | "device">("tablets");
  const [unitsPerStrip, setUnitsPerStrip] = useState(10);
  const [totalUnits, setTotalUnits] = useState(0);
  const [contentHeight, setContentHeight] = useState("auto");

  // Determine medicine type
  useEffect(() => {
    if (medicine.name) {
      const lowerName = medicine.name.toLowerCase();
      if (lowerName.includes("solution") || 
          lowerName.includes("gel") || 
          lowerName.includes("drops") ||
          lowerName.includes("cream") ||
          lowerName.includes("syrup") ||
          lowerName.includes("liquid") ||
          lowerName.includes("lotion")) {
        setMedicineType("liquid");
      } else if (lowerName.includes("monitor") || 
                lowerName.includes("thermometer") ||
                lowerName.includes("device") ||
                lowerName.includes("machine") ||
                lowerName.includes("meter") ||
                lowerName.includes("tester") ||
                lowerName.includes("glasses")) {
        setMedicineType("device");
      } else {
        setMedicineType("tablets");
      }
    }
  }, [medicine.name]);

  // Calculate total units
  useEffect(() => {
    if (medicineType === "tablets") {
      setTotalUnits(quantity + (strips * unitsPerStrip));
    } else {
      setTotalUnits(quantity);
    }
  }, [quantity, strips, medicineType, unitsPerStrip]);

  // Set content height based on window size for better mobile experience
  useEffect(() => {
    const updateContentHeight = () => {
      const vh = window.innerHeight;
      const maxHeight = vh * 0.45; // 45% of viewport height for content
      setContentHeight(`${maxHeight}px`);
    };

    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);
    
    return () => window.removeEventListener('resize', updateContentHeight);
  }, []);

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

  const isLiquid = medicineType === "liquid";
  const isDevice = medicineType === "device";

  // Default inStock to true if not specified
  const inStock = medicine.inStock !== undefined ? medicine.inStock : true;

  return (
    <motion.div
      className="bg-[#1a1a2e] border border-gray-800 rounded-xl w-full max-w-md mx-auto overflow-hidden shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col max-h-[90vh]">
        <MedicineHeader 
          medicine={medicine} 
          discount={discount} 
          onClose={onClose} 
        />
        
        {/* Additional Medicine Info */}
        <div className="px-4 py-3 bg-gray-900/60 grid grid-cols-2 gap-3">
          {medicine.manufacturer && (
            <div className="flex items-center text-xs text-gray-300">
              <Building className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
              <span>{medicine.manufacturer}</span>
            </div>
          )}
          
          {medicine.expiryDate && (
            <div className="flex items-center text-xs text-gray-300">
              <Calendar className="h-3.5 w-3.5 text-orange-400 mr-1.5" />
              <span>{medicine.expiryDate}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-300">
            <Truck className="h-3.5 w-3.5 text-green-400 mr-1.5" />
            <span>Free Delivery</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-300">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400 mr-1.5" />
            <span>100% Genuine</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-5 pt-4 pb-4">
            {!inStock && (
              <div className="mb-4 bg-red-900/30 border border-red-800 rounded-md p-3 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <p className="text-red-200 text-sm font-medium">Not in stock right now, we will notify you</p>
              </div>
            )}
            
            <TabSelector 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            
            <div 
              className="border border-gray-800 rounded-lg p-4 mb-6 bg-black/30 overflow-y-auto" 
              style={{ maxHeight: contentHeight }}
            >
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
              medicineType={medicineType}
              unitsPerStrip={unitsPerStrip}
              totalQuantity={totalUnits}
            />
            
            <ActionButtons 
              onClose={onClose} 
              handleAddToCart={handleAddToCart}
              disabled={!inStock}
              inStock={inStock}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineDetailContent;
