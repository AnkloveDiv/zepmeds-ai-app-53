
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import MedicineDetailModal from "@/components/MedicineDetailModal";

// Import refactored components
import LocationWeather from "@/components/medicine/LocationWeather";
import DealBanners from "@/components/medicine/DealBanners";
import ActionButtons from "@/components/medicine/ActionButtons";
import CategoriesNav from "@/components/medicine/CategoriesNav";
import ProductGrid from "@/components/medicine/ProductGrid";
import OfferBanner from "@/components/medicine/OfferBanner";
import FloatingCartButton from "@/components/medicine/FloatingCartButton";
import SearchBar from "@/components/SearchBar";
import DeliveryTracking from "@/components/medicine/DeliveryTracking";

interface MedicineContentProps {
  products: any[];
  setCartItems: (items: any[]) => void;
}

const MedicineContent = ({ products, setCartItems }: MedicineContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [userLocation] = useState("Current Location");
  const [temperature] = useState("28°C");
  const [weather] = useState("Sunny");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
        "petcare": "Pet Care",
        "devices": "Popular"
      };
      
      const mappedCategory = categoryMap[categoryParam] || "All";
      setActiveCategory(mappedCategory);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

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

  return (
    <div className="px-4 py-4">
      <LocationWeather 
        location={userLocation} 
        temperature={temperature} 
        weather={weather} 
      />

      <SearchBar placeholder="Search for medicines, health products..." />
      
      <DealBanners />

      <ActionButtons onUploadPrescription={handleUploadPrescription} />
      
      {/* Add track order section */}
      <DeliveryTracking />

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
        itemsCount={JSON.parse(localStorage.getItem("cart") || "[]").length} 
        onClick={handleViewCart} 
      />
      
      <MedicineDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={selectedMedicine}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};

export default MedicineContent;
