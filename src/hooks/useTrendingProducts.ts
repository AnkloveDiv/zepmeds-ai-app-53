
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TrendingProduct } from "@/types/productTypes";
import { initialProducts } from "@/data/initialProductsData";
import { addToCart } from "@/utils/cartUtils";
import { useProductImages } from "./useProductImages";
import { useProductAnimation } from "./useProductAnimation";

export type { TrendingProduct } from "@/types/productTypes";

export const useTrendingProducts = (setCartCount: (count: number) => void) => {
  const { toast } = useToast();
  const [selectedMedicine, setSelectedMedicine] = useState<TrendingProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Load product images
  const { products } = useProductImages(initialProducts);
  
  // Handle animations
  const { 
    showAnimation, 
    animatedProduct, 
    triggerAnimation, 
    setShowAnimation 
  } = useProductAnimation();

  const handleProductClick = (product: TrendingProduct) => {
    setSelectedMedicine(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: TrendingProduct, quantity: number = 1, strips: number = 1) => {
    const cartCount = addToCart(product, quantity, strips);
    setCartCount(cartCount);
    
    triggerAnimation(product.name);
  };

  const handleModalAddToCart = (quantity: number, strips: number) => {
    if (selectedMedicine) {
      handleAddToCart(selectedMedicine, quantity, strips);
      setIsModalOpen(false);
      toast({
        title: "Added to cart",
        description: `${quantity} ${selectedMedicine.name} added to cart`,
      });
    }
  };

  return {
    products,
    selectedMedicine,
    isModalOpen,
    showAnimation,
    animatedProduct,
    handleProductClick,
    handleAddToCart,
    handleModalAddToCart,
    setIsModalOpen,
    setShowAnimation
  };
};
