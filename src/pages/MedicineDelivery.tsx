
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import SearchBar from "@/components/SearchBar";

// Import refactored components
import AdvertisementSection from "@/components/medicine/AdvertisementSection";
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
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
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
    
    // Check for category param from URL
    const categoryParam = params.get("category");
    if (categoryParam) {
      const formattedCategory = formatCategory(categoryParam);
      setActiveCategory(formattedCategory);
      filterProductsByCategory(formattedCategory);
    }
  }, [location.search]);

  const formatCategory = (category: string): string => {
    // Convert camelCase or lowercase to proper format
    // e.g. 'skincare' -> 'Skin Care'
    const words = category.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleAddToCart = (product: any, quantity: number) => {
    // Animation is handled by CSS classes and transitions
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
    filterProductsByCategory(categoryName);
  };
  
  const filterProductsByCategory = (categoryName: string) => {
    if (categoryName === "All" || categoryName === "Popular") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.category && product.category.includes(categoryName)
      );
      setFilteredProducts(filtered);
    }
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
        
        <AdvertisementSection advertisements={advertisements} />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
