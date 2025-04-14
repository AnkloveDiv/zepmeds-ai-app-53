
import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Truck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const contentRef = useRef<HTMLDivElement>(null);

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
      className="bg-[#1a1a2e] border border-gray-800 rounded-xl w-full mx-auto overflow-hidden shadow-xl flex flex-col max-h-[100dvh]"
      onClick={(e) => e.stopPropagation()}
    >
      <MedicineHeader 
        medicine={medicine} 
        discount={discount} 
        onClose={onClose} 
      />
      
      {/* Updated Medicine Info with new icon style */}
      <div className="px-4 py-3 bg-gray-900/60">
        <div className="grid grid-cols-2 gap-3">
          {medicine.manufacturer && (
            <div className="flex items-center text-xs text-gray-300">
              <div className="w-5 h-5 mr-1.5 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" />
                </svg>
              </div>
              <span>{medicine.manufacturer}</span>
            </div>
          )}
          
          {medicine.expiryDate && (
            <div className="flex items-center text-xs text-gray-300">
              <div className="w-5 h-5 mr-1.5 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z" />
                </svg>
              </div>
              <span>{medicine.expiryDate}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-300">
            <div className="w-5 h-5 mr-1.5 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2V16H3V19C3,20.66 4.34,22 6,22H18C19.66,22 21,20.66 21,19V2L19.5,3.5M19,19C19,19.55 18.55,20 18,20H6C5.45,20 5,19.55 5,19V16H19V19M19,14H6V4.08L7.5,5.58L9,4.08L10.5,5.58L12,4.08L13.5,5.58L15,4.08L16.5,5.58L18,4.08L19,5.08V14Z" />
              </svg>
            </div>
            <span>Free Delivery</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-300">
            <div className="w-5 h-5 mr-1.5 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
            </div>
            <span>100% Genuine</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area with ScrollArea for better scrolling */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 pt-3 pb-0">
          {!inStock && (
            <div className="mb-3 bg-red-900/30 border border-red-800 rounded-md p-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-red-200 text-sm font-medium">Not in stock right now, we will notify you</p>
            </div>
          )}
          
          <TabSelector 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
        
        <ScrollArea className="flex-1 px-4 pb-3 pt-1">
          <div 
            ref={contentRef}
            className="border border-gray-800 rounded-lg p-4 mb-4 bg-black/30"
          >
            <TabContent 
              activeTab={activeTab} 
              medicine={medicine} 
            />
          </div>
          
          <div className="border-t border-gray-700 my-4"></div>
          
          {/* Quantity Selector */}
          {(isLiquid || isDevice) ? (
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
          ) : (
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
          )}
        </ScrollArea>
        
        {/* Action Buttons (fixed at bottom) */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-800 bg-gray-900/40">
          <ActionButtons 
            onClose={onClose} 
            handleAddToCart={handleAddToCart}
            disabled={!inStock}
            inStock={inStock}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineDetailContent;
