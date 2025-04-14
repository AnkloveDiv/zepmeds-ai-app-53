
import { useState } from "react";
import MedicineDetailModal from "@/components/MedicineDetailModal";
import ProductAddedAnimation from "@/components/medicine/ProductAddedAnimation";
import SortButtons from "./filter/SortButtons";
import EmptyProductState from "./EmptyProductState";
import ProductGridContent from "./ProductGridContent";
import { useProductFilter } from "./filter/useProductFilter";
import { TrendingProduct } from "@/types/productTypes";

interface EnhancedProductGridProps {
  products: TrendingProduct[];
  searchQuery?: string;
  onAddToCart: (product: TrendingProduct, quantity?: number) => void;
}

const EnhancedProductGrid = ({ 
  products, 
  searchQuery = "", 
  onAddToCart 
}: EnhancedProductGridProps) => {
  const { activeFilter, sortBy, handleFilterClick, handleSortChange, filterProducts } = 
    useProductFilter({ products, searchQuery });
    
  const [selectedProduct, setSelectedProduct] = useState<TrendingProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatedProduct, setAnimatedProduct] = useState("");

  const displayedProducts = filterProducts();

  const handleProductClick = (product: TrendingProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCartFromModal = (quantity: number, strips: number) => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, quantity);
      
      // Show animation
      setAnimatedProduct(selectedProduct.name);
      setShowAnimation(true);
      
      setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
      
      setIsModalOpen(false);
    }
  };

  const handleAddToCartFromCard = (product: TrendingProduct) => {
    onAddToCart(product);
    
    // Show animation
    setAnimatedProduct(product.name);
    setShowAnimation(true);
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <SortButtons sortBy={sortBy} onSortChange={handleSortChange} />

      {displayedProducts.length === 0 ? (
        <EmptyProductState />
      ) : (
        <ProductGridContent 
          products={displayedProducts}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCartFromCard}
        />
      )}
      
      {/* Medicine detail modal */}
      <MedicineDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={selectedProduct}
        onAddToCart={handleAddToCartFromModal}
      />
      
      {/* Product added animation */}
      <ProductAddedAnimation
        productName={animatedProduct}
        isVisible={showAnimation}
        onAnimationComplete={() => setShowAnimation(false)}
      />
    </div>
  );
};

export default EnhancedProductGrid;
