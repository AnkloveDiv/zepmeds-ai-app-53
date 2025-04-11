
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import EnhancedProductGrid from "@/components/medicine/EnhancedProductGrid";
import CategoriesNav from "@/components/medicine/CategoriesNav";
import DealBanners from "@/components/medicine/DealBanners";
import OfferBanner from "@/components/medicine/OfferBanner";
import LocationWeather from "@/components/medicine/LocationWeather";
import { useToast } from "@/components/ui/use-toast";

interface MedicineContentProps {
  products: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const MedicineContent = ({ products, setCartItems }: MedicineContentProps) => {
  const [cartItems, setLocalCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [userLocation, setUserLocation] = useState("New York, NY");
  const location = useLocation();
  const { toast } = useToast();
  
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
    
    // Check for category from URL
    const categoryParam = params.get("category");
    if (categoryParam) {
      // Convert categories like "skincare" to "Skin Care" for display
      const formattedCategory = categoryParam
        .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
      
      setActiveCategory(formattedCategory);
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
    
    // Show toast notification with animation
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
    
    // Trigger a cart animation
    const cartIcon = document.querySelector('.cart-icon'); // You need to add this class to your cart icon
    if (cartIcon) {
      cartIcon.classList.add('cart-animation');
      setTimeout(() => {
        cartIcon.classList.remove('cart-animation');
      }, 1000);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    // Filter products by category
  };

  const handleLocationSave = (newLocation: string) => {
    setUserLocation(newLocation);
    toast({
      title: "Location updated",
      description: `Your delivery location has been updated to ${newLocation}.`,
      duration: 3000,
    });
  };

  // Filter products by selected category
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="px-4 py-4">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SearchBar placeholder="Search medicines and healthcare products" />
      </motion.div>
      
      <LocationWeather 
        location={userLocation} 
        temperature="24°C" 
        weather="Sunny"
        onLocationSave={handleLocationSave}
      />
      
      <CategoriesNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      
      <DealBanners />
      
      <div className="my-4">
        <h2 className="text-xl font-bold text-white mb-3">
          {activeCategory === "All" ? "All Products" : `${activeCategory} Products`}
        </h2>
        <EnhancedProductGrid 
          products={filteredProducts} 
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart} 
        />
      </div>
      
      <OfferBanner />
      
      {/* Add animations for cart */}
      <style jsx>{`
        @keyframes cartPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        .cart-animation {
          animation: cartPulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MedicineContent;
