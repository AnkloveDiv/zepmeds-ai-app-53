
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import MedicineDetailModal from "@/components/MedicineDetailModal";
import ProductAddedAnimation from "@/components/medicine/ProductAddedAnimation";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  description?: string;
  category?: string;
  fullDescription?: string;
  ingredients?: string[];
  manufacturer?: string;
  expiryDate?: string;
  saltComposition?: string;
  howItWorks?: string;
  directions?: string;
  quickTips?: string[];
  faqs?: { question: string; answer: string }[];
  dosage?: string;
  sideEffects?: string[];
}

interface EnhancedProductGridProps {
  products: Product[];
  searchQuery?: string;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const EnhancedProductGrid = ({ 
  products, 
  searchQuery = "", 
  onAddToCart 
}: EnhancedProductGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatedProduct, setAnimatedProduct] = useState("");

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const filterProducts = () => {
    let filteredProducts = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (activeFilter) {
      filteredProducts = filteredProducts.filter(
        product => product.category === activeFilter
      );
    }
    
    // Apply sorting
    if (sortBy === "price-low") {
      filteredProducts.sort((a, b) => {
        const aPrice = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const bPrice = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return aPrice - bPrice;
      });
    } else if (sortBy === "price-high") {
      filteredProducts.sort((a, b) => {
        const aPrice = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const bPrice = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return bPrice - aPrice;
      });
    } else if (sortBy === "discount") {
      filteredProducts.sort((a, b) => {
        const aDiscount = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
        const bDiscount = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
        return bDiscount - aDiscount;
      });
    } else if (sortBy === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    return filteredProducts;
  };

  const displayedProducts = filterProducts();

  const handleProductClick = (product: Product) => {
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

  const handleAddToCartFromCard = (product: Product) => {
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
      <div className="flex overflow-x-auto gap-2 scrollbar-hide py-2">
        <button
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
            sortBy === "popular"
              ? "bg-zepmeds-purple text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => handleSortChange("popular")}
        >
          Popular
        </button>
        <button
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
            sortBy === "price-low"
              ? "bg-zepmeds-purple text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => handleSortChange("price-low")}
        >
          Price: Low to High
        </button>
        <button
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
            sortBy === "price-high"
              ? "bg-zepmeds-purple text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => handleSortChange("price-high")}
        >
          Price: High to Low
        </button>
        <button
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
            sortBy === "discount"
              ? "bg-zepmeds-purple text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => handleSortChange("discount")}
        >
          Highest Discount
        </button>
        <button
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
            sortBy === "rating"
              ? "bg-zepmeds-purple text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => handleSortChange("rating")}
        >
          Top Rated
        </button>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="bg-gray-800/30 rounded-lg p-8 text-center">
          <Search className="mx-auto h-10 w-10 text-gray-500 mb-3" />
          <h3 className="text-white font-semibold text-lg">No products found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <ProductCard
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  rating={product.rating}
                  description={product.description}
                  onClick={() => handleProductClick(product)}
                  onAddToCart={() => handleAddToCartFromCard(product)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
