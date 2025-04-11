import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import EnhancedProductGrid from "@/components/medicine/EnhancedProductGrid";
import CategoriesNav from "@/components/medicine/CategoriesNav";
import DealBanners from "@/components/medicine/DealBanners";
import OfferBanner from "@/components/medicine/OfferBanner";
import LocationWeather from "@/components/medicine/LocationWeather";
import DeliveryTracking from "@/components/medicine/DeliveryTracking";

interface MedicineContentProps {
  products: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const MedicineContent = ({ products, setCartItems }: MedicineContentProps) => {
  const [cartItems, setLocalCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setLocalCartItems(parsedCart);
    }
    
    // Check for search query from URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handleAddToCart = (product: any, quantity: number) => {
    const newCart = [...cartItems];
    const existingItemIndex = newCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      newCart[existingItemIndex].quantity += quantity;
    } else {
      newCart.push({...product, quantity});
    }
    
    setLocalCartItems(newCart);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="px-4 py-4">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SearchBar placeholder="Search medicines and healthcare products" />
      </motion.div>
      
      <LocationWeather />
      
      <DeliveryTracking />
      
      <CategoriesNav />
      
      <DealBanners />
      
      <div className="my-4">
        <h2 className="text-xl font-bold text-white mb-3">All Products</h2>
        <EnhancedProductGrid 
          products={products} 
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart} 
        />
      </div>
      
      <OfferBanner />
    </div>
  );
};

export default MedicineContent;
