
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";

// Import refactored components
import MedicineContent from "@/components/medicine/MedicineContent";
import AdvertisementSection from "@/components/medicine/AdvertisementSection";

// Import data
import { allProducts, advertisements } from "@/data/medicineData";

const MedicineDelivery = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  useBackNavigation();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medicine Delivery" cartCount={cartItems.length} />

      <main>
        <MedicineContent 
          products={allProducts} 
          setCartItems={setCartItems} 
        />
        
        <AdvertisementSection advertisements={advertisements} />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
