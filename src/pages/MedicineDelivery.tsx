
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import SearchBar from "@/components/SearchBar";

// Import refactored components
import AdvertisementSection from "@/components/medicine/AdvertisementSection";
import DeliveryTracking from "@/components/medicine/DeliveryTracking";
import CategoriesNav from "@/components/medicine/CategoriesNav";
import DealBanners from "@/components/medicine/DealBanners";
import OfferBanner from "@/components/medicine/OfferBanner";
import LocationWeather from "@/components/medicine/LocationWeather";
import EnhancedProductGrid from "@/components/medicine/EnhancedProductGrid";

// Import data
import { allProducts, advertisements } from "@/data/medicineData";

const MedicineDelivery = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [userLocation, setUserLocation] = useState("New York, NY");
  const location = useLocation();
  
  useBackNavigation();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
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
    
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    // In a real app, you might filter products by category here
  };

  const handleLocationSave = (newLocation: string) => {
    setUserLocation(newLocation);
    // In a real app, you might update user preferences or fetch weather for the new location
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medicine Delivery" cartCount={cartItems.length} />

      <main className="px-4 py-4">
        <SearchBar placeholder="Search medicines and healthcare products" />
        
        <LocationWeather 
          location={userLocation} 
          temperature="24°C" 
          weather="Sunny"
          onLocationSave={handleLocationSave}
        />
        
        <DeliveryTracking />
        
        <CategoriesNav 
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        
        <DealBanners />
        
        <div className="my-4">
          <h2 className="text-xl font-bold text-white mb-3">All Products</h2>
          <EnhancedProductGrid 
            products={allProducts} 
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart} 
          />
        </div>
        
        <OfferBanner />
        
        <AdvertisementSection advertisements={advertisements} />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
