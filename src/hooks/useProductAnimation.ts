
import { useState } from "react";

/**
 * Custom hook to manage product animations
 */
export const useProductAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatedProduct, setAnimatedProduct] = useState("");

  const triggerAnimation = (productName: string) => {
    setAnimatedProduct(productName);
    setShowAnimation(true);
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  return {
    showAnimation,
    animatedProduct,
    triggerAnimation,
    setShowAnimation
  };
};
