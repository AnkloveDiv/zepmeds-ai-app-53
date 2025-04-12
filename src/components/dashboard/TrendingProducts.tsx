
import { ShoppingBag } from "lucide-react";
import MedicineDetailModal from "@/components/MedicineDetailModal";
import ProductAddedAnimation from "@/components/medicine/ProductAddedAnimation";
import TrendingProductGrid from "./trending/TrendingProductGrid";
import TrendingHeader from "./trending/TrendingHeader";
import { useTrendingProducts } from "@/hooks/useTrendingProducts";

type TrendingProductsProps = {
  setCartCount: (count: number) => void;
};

const TrendingProducts = ({ setCartCount }: TrendingProductsProps) => {
  const {
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
  } = useTrendingProducts(setCartCount);

  return (
    <section className="mt-8">
      <TrendingHeader />
      
      <TrendingProductGrid 
        products={products}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {/* Medicine detail modal */}
      <MedicineDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={selectedMedicine}
        onAddToCart={handleModalAddToCart}
      />

      {/* Product added animation */}
      <ProductAddedAnimation 
        productName={animatedProduct}
        isVisible={showAnimation}
        onAnimationComplete={() => setShowAnimation(false)}
      />
    </section>
  );
};

export default TrendingProducts;
