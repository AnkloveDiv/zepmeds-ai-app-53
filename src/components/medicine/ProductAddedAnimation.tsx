
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";

interface ProductAddedAnimationProps {
  productName: string;
  isVisible: boolean;
  onAnimationComplete: () => void;
}

const ProductAddedAnimation: React.FC<ProductAddedAnimationProps> = ({ 
  productName, 
  isVisible, 
  onAnimationComplete 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete();
      }, 1500); // Animation duration - reduced from previous value
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div 
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-zepmeds-purple text-white py-3 px-5 rounded-full flex items-center gap-3 shadow-lg"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              } 
            }}
            exit={{ 
              scale: 0.8, 
              y: -100, 
              opacity: 0,
              transition: { duration: 0.3 } 
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
                transition: { 
                  duration: 0.5,
                  repeat: 1,
                  repeatType: "reverse"
                }
              }}
            >
              <ShoppingCart size={24} />
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.2 }
              }}
            >
              {productName} added to cart!
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductAddedAnimation;
