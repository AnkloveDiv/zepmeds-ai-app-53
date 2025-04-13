
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    inStock?: boolean;
  } | null;
  onAddToCart: (quantity: number, strips: number) => void;
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  isOpen,
  onClose,
  medicine,
  onAddToCart,
}) => {
  // Control body scroll when modal is open/closed
  useEffect(() => {
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
          className="fixed inset-0 bg-black/80 z-50 px-4 py-3 overflow-hidden flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MedicineDetailContent 
              medicine={medicine}
              onClose={onClose}
              onAddToCart={onAddToCart}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedicineDetailModal;
