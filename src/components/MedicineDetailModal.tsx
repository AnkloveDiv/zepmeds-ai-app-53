
import React from "react";
import { AnimatePresence } from "framer-motion";
import MedicineDetailContent from "./medicine/detail/MedicineDetailContent";

interface MedicineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  } | null;
  onAddToCart: (quantity: number, strips: number) => void;
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  isOpen,
  onClose,
  medicine,
  onAddToCart,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!medicine) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
          onClick={onClose}
        >
          <MedicineDetailContent 
            medicine={medicine}
            onClose={onClose}
            onAddToCart={onAddToCart}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedicineDetailModal;
