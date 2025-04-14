
import React, { useState } from 'react';
import { motion } from "framer-motion";
import MedicineImage from './components/MedicineImage';
import MedicineDetails from './components/MedicineDetails';
import MedicineTabs from './components/MedicineTabs';
import MedicineQuantity from './components/MedicineQuantity';
import { useMedicineQuantity } from './hooks/useMedicineQuantity';
import { detectMedicineType } from './utils/detectMedicineType';

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
  
  // Use the custom hook for quantity management
  const {
    quantity,
    strips,
    animateQuantity,
    handleIncrementQuantity,
    handleDecrementQuantity,
    triggerAnimation
  } = useMedicineQuantity(medicine.name);

  // Determine if the medicine is liquid
  const medicineType = detectMedicineType(medicine.name);
  const isLiquid = medicineType === "liquid";

  // Calculate discount percentage
  const discount = medicine.discountPrice 
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100) 
    : 0;

  const handleAddToCart = () => {
    onAddToCart(quantity, strips);
    triggerAnimation();
  };

  return (
    <motion.div
      className="bg-black border border-gray-800 rounded-xl w-full mx-auto overflow-hidden shadow-xl flex flex-col max-h-[90dvh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Medicine Image with Discount Badge */}
      <MedicineImage 
        image={medicine.image} 
        name={medicine.name} 
        discount={discount} 
        onClose={onClose} 
      />
      
      {/* Medicine Details Section */}
      <MedicineDetails 
        name={medicine.name}
        isLiquid={isLiquid}
        volume={isLiquid ? "125 ML" : undefined}
        quantity={quantity}
        price={medicine.price}
        discountPrice={medicine.discountPrice}
        manufacturer={medicine.manufacturer}
        saltComposition={medicine.saltComposition}
      />
      
      {/* Tabs Content - Scrollable Area */}
      <MedicineTabs 
        medicine={medicine} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Quantity Stepper and Add to Cart Button */}
      <MedicineQuantity 
        medicine={medicine}
        quantity={quantity}
        handleIncrementQuantity={handleIncrementQuantity}
        handleDecrementQuantity={handleDecrementQuantity}
        handleAddToCart={handleAddToCart}
        animateQuantity={animateQuantity}
      />
    </motion.div>
  );
};

export default MedicineDetailContent;
