
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";
import ServiceSection from "@/components/dashboard/ServiceSection";
import CategorySection from "@/components/dashboard/CategorySection";
import TrendingProducts from "@/components/dashboard/TrendingProducts";
import OfferBanner from "@/components/dashboard/OfferBanner";
import AdFlyer from "@/components/dashboard/AdFlyer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  // Use the custom hook for back navigation with the exit dialog
  const { ExitConfirmDialog } = useBackNavigation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Load cart count on mount
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setCartCount(cartItems.length);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header cartCount={cartCount} />

      <main className="px-4 py-4">
        <AnimatedSearchBar />
        <AdFlyer />
        <ServiceSection />
        <CategorySection />
        <TrendingProducts setCartCount={setCartCount} />
        <OfferBanner />
      </main>

      <BottomNavigation />
      
      {/* Exit confirmation dialog */}
      <ExitConfirmDialog />
    </div>
  );
};

export default Dashboard;
