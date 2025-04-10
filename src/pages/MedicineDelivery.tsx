
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";
import MedicineDetailModal from "@/components/MedicineDetailModal";
import DeliveryAnimation from "@/components/DeliveryAnimation";

// Import refactored components
import LocationWeather from "@/components/medicine/LocationWeather";
import DealBanners from "@/components/medicine/DealBanners";
import ActionButtons from "@/components/medicine/ActionButtons";
import CategoriesNav from "@/components/medicine/CategoriesNav";
import ProductGrid from "@/components/medicine/ProductGrid";
import FloatingCartButton from "@/components/medicine/FloatingCartButton";
import OfferBanner from "@/components/medicine/OfferBanner";
import AdvertisementModal from "@/components/medicine/AdvertisementModal";

// Import data
import { allProducts, advertisements } from "@/data/medicineData";

const MedicineDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [userLocation] = useState("Current Location");
  const [temperature] = useState("28°C");
  const [weather] = useState("Sunny");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvertisement, setShowAdvertisement] = useState(false);

  useBackNavigation();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    const adTimer = setTimeout(() => {
      setShowAdvertisement(true);
    }, 3000);
    
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    
    if (categoryParam) {
      const categoryMap: { [key: string]: string } = {
        "skincare": "Popular",
        "supplements": "Popular",
        "eyecare": "Eye Care",
        "dental": "Dental",
        "painrelief": "Pain",
        "brain": "Brain",
        "summercare": "Summer",
        "devices": "Popular"
      };
      
      const mappedCategory = categoryMap[categoryParam] || "All";
      setActiveCategory(mappedCategory);
    }
    
    return () => clearTimeout(adTimer);
  }, [location.search]);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(product => product.category === activeCategory));
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleUploadPrescription = () => {
    navigate("/prescription-upload");
  };

  const handleAddToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        stripQuantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartItems(existingCart);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      duration: 4000,
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedMedicine(product);
    setIsModalOpen(true);
  };

  const handleModalAddToCart = (quantity: number, strips: number) => {
    if (selectedMedicine) {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      const existingItemIndex = existingCart.findIndex((item: any) => item.id === selectedMedicine.id);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity = quantity;
        existingCart[existingItemIndex].stripQuantity = strips;
      } else {
        existingCart.push({
          ...selectedMedicine,
          quantity: quantity,
          stripQuantity: strips
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(existingCart));
      setCartItems(existingCart);
      
      toast({
        title: "Added to cart",
        description: `${selectedMedicine.name} has been added to your cart`,
        duration: 4000,
      });
    }
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const randomAdIndex = Math.floor(Math.random() * advertisements.length);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medicine Delivery" cartCount={cartItems.length} />

      <main className="px-4 py-4">
        <LocationWeather 
          location={userLocation} 
          temperature={temperature} 
          weather={weather} 
        />

        <SearchBar placeholder="Search for medicines, health products..." />
        
        <div className="my-4 p-3 rounded-xl glass-morphism">
          <DeliveryAnimation />
        </div>
        
        <DealBanners />

        <ActionButtons onUploadPrescription={handleUploadPrescription} />

        <CategoriesNav 
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
        />
        
        <OfferBanner />

        <FloatingCartButton 
          itemsCount={cartItems.length} 
          onClick={handleViewCart} 
        />
        
        <MedicineDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medicine={selectedMedicine}
          onAddToCart={handleModalAddToCart}
        />
        
        {showAdvertisement && (
          <AdvertisementModal 
            {...advertisements[randomAdIndex]} 
            onClose={() => setShowAdvertisement(false)} 
          />
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
