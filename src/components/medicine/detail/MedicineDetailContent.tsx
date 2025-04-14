
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, ScrollText, Pill, ArrowRight, CircleHelp, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { detectMedicineType } from "./utils/detectMedicineType";
import { useQuantityManager } from "./hooks/useQuantityManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DescriptionTab,
  DirectionsTab,
  HowItWorksTab,
  QuickTipsTab,
  FAQsTab
} from "./tabs";

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
  const [activeTab, setActiveTab] = useState("description");
  const medicineType = detectMedicineType(medicine.name);
  
  // Use the quantity manager hook
  const {
    quantity,
    setQuantity,
    strips,
    setStrips,
    handleDecrement,
    handleIncrement
  } = useQuantityManager(medicineType);

  const handleAddToCart = () => {
    onAddToCart(quantity, strips);
  };

  const discount = medicine.discountPrice 
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100) 
    : 0;

  // Default inStock to true if not specified
  const inStock = medicine.inStock !== undefined ? medicine.inStock : true;

  return (
    <motion.div
      className="bg-[#1a1a2e] border border-gray-800 rounded-xl w-full mx-auto overflow-hidden shadow-xl flex flex-col max-h-[100dvh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Medicine Image with Discount Badge */}
      <div className="relative">
        <img 
          src={medicine.image} 
          alt={medicine.name} 
          className="w-full h-48 object-contain bg-gradient-to-r from-gray-800 to-gray-900 p-2"
        />
        
        {discount > 0 && (
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
      
      {/* Medicine Name, Rating, Description & Price */}
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
      
      {/* Medicine Information */}
      <div className="px-4 py-2 border-t border-b border-gray-800/50 bg-gray-900/20">
        <div className="grid grid-cols-2 gap-y-3">
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" />
              </svg>
            </span>
            {medicine.manufacturer || "SclіKort"}
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z" />
              </svg>
            </span>
            {medicine.expiryDate || "Jan 2026"}
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2V16H3V19C3,20.66 4.34,22 6,22H18C19.66,22 21,20.66 21,19V2L19.5,3.5M19,19C19,19.55 18.55,20 18,20H6C5.45,20 5,19.55 5,19V16H19V19M19,14H6V4.08L7.5,5.58L9,4.08L10.5,5.58L12,4.08L13.5,5.58L15,4.08L16.5,5.58L18,4.08L19,5.08V14Z" />
              </svg>
            </span>
            Free Delivery
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
            </span>
            100% Genuine
          </div>
        </div>
      </div>
      
      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="description" className="w-full">
          <div className="p-2 bg-gray-900/20 border-b border-gray-800">
            <TabsList className="w-full h-auto bg-gray-900/30 p-1">
              <TabsTrigger 
                value="description" 
                className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                onClick={() => setActiveTab("description")}
              >
                <Info className="h-3.5 w-3.5" />
                <span>Description</span>
              </TabsTrigger>
              <TabsTrigger 
                value="directions" 
                className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                onClick={() => setActiveTab("directions")}
              >
                <ScrollText className="h-3.5 w-3.5" />
                <span>Directions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="howItWorks" 
                className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                onClick={() => setActiveTab("howItWorks")}
              >
                <Pill className="h-3.5 w-3.5" />
                <span>How it Works</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-40 px-4 py-3">
            <TabsContent value="description" className="m-0">
              <DescriptionTab medicine={medicine} />
            </TabsContent>
            <TabsContent value="directions" className="m-0">
              <DirectionsTab medicine={medicine} />
            </TabsContent>
            <TabsContent value="howItWorks" className="m-0">
              <HowItWorksTab medicine={medicine} medicineType={medicineType} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Quantity Stepper and Add to Cart Button */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">Quantity</span>
          
          <div className="flex items-center bg-gray-800 rounded-md">
            <motion.button 
              className="p-2 text-white"
              onClick={() => handleDecrement(setQuantity, quantity)}
              whileTap={{ scale: 0.9 }}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            
            <span className="px-4 text-white">{quantity}</span>
            
            <motion.button 
              className="p-2 text-white"
              onClick={() => handleIncrement(setQuantity, quantity)}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-indigo-600 text-white rounded-md flex items-center justify-center font-medium"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MedicineDetailContent;
