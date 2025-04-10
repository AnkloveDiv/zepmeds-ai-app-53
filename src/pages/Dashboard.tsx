import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import AnimatedSearchBar from "@/components/AnimatedSearchBar";
import ServiceCard from "@/components/ServiceCard";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Pill,
  FileUp,
  MessageSquareText,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Stethoscope as DentalIcon,
  Bone,
  Sun,
  Thermometer,
  ShoppingBag
} from "lucide-react";

const placeholderImg = "/placeholder.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Handle back button
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      if (window.confirm("Do you wish to exit?")) {
        // Exit app logic would go here for a mobile app
        // For web, we'd typically do nothing and let the browser handle it
      } else {
        // Stay in app - push a new entry to cancel the back
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    
    // Push an initial state
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);
    
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isLoggedIn, navigate]);

  const services = [
    {
      title: "Medicine Delivery",
      description: "Order medicines online",
      icon: <Pill className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-400",
      onClick: () => navigate("/medicine-delivery")
    },
    {
      title: "Upload Prescription",
      description: "Get medicines as prescribed",
      icon: <FileUp className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-purple-600 to-purple-400",
      onClick: () => navigate("/prescription-upload")
    },
    {
      title: "AI Symptom Checker",
      description: "Get instant health insights",
      icon: <MessageSquareText className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-green-600 to-green-400",
      onClick: () => navigate("/symptom-checker")
    },
    {
      title: "Consult Doctor",
      description: "Online consultation",
      icon: <Stethoscope className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-red-600 to-red-400",
      onClick: () => navigate("/doctor")
    }
  ];

  const categories = [
    { name: "Skin Care", icon: <Heart className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF6B6B, #FFD166)", onClick: () => navigate("/medicine-delivery?category=skincare") },
    { name: "Supplements", icon: <Pill className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #4E65FF, #92EFFD)", onClick: () => navigate("/medicine-delivery?category=supplements") },
    { name: "Eye Care", icon: <Eye className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #33D9B2, #00B5AA)", onClick: () => navigate("/medicine-delivery?category=eyecare") },
    { name: "Dental", icon: <DentalIcon className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #706FD3, #98D9EA)", onClick: () => navigate("/medicine-delivery?category=dental") },
    { name: "Pain Relief", icon: <Bone className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF5E3A, #FF9E80)", onClick: () => navigate("/medicine-delivery?category=painrelief") },
    { name: "Brain", icon: <Brain className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #6A5ACD, #A17FE0)", onClick: () => navigate("/medicine-delivery?category=brain") },
    { name: "Summer Care", icon: <Sun className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF9E2C, #FFD66B)", onClick: () => navigate("/medicine-delivery?category=summercare") },
    { name: "Devices", icon: <Thermometer className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #4776E6, #8E54E9)", onClick: () => navigate("/medicine-delivery?category=devices") }
  ];

  const products = [
    { id: "prod1", name: "Vitamin C Tablets", image: placeholderImg, price: 350, discountPrice: 280, rating: 4.5, description: "Immunity Booster" },
    { id: "prod2", name: "Digital Thermometer", image: placeholderImg, price: 500, discountPrice: 399, rating: 4.2, description: "Accurate Reading" },
    { id: "prod3", name: "Pain Relief Gel", image: placeholderImg, price: 220, discountPrice: null, rating: 4.0, description: "Fast Relief" },
    { id: "prod4", name: "Multivitamin Capsules", image: placeholderImg, price: 450, discountPrice: 410, rating: 4.7, description: "Daily Nutrition" }
  ];

  const handleProductClick = (product: any) => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        ...product,
        quantity: 1,
        stripQuantity: 1
      });
    }
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Navigate to medicine delivery
    navigate("/medicine-delivery");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        <AnimatedSearchBar />

        <section className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  color={service.color}
                  onClick={service.onClick}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Categories</h2>
            <button 
              className="text-sm text-zepmeds-purple"
              onClick={() => navigate("/medicine-delivery")}
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
            <div className="flex space-x-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                >
                  <CategoryCard
                    icon={category.icon}
                    name={category.name}
                    gradient={category.gradient}
                    onClick={category.onClick}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Trending Products</h2>
            <button 
              className="text-sm text-zepmeds-purple"
              onClick={() => navigate("/medicine-delivery")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                onClick={() => handleProductClick(product)}
              >
                <ProductCard
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  rating={product.rating}
                  description={product.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="glass-morphism rounded-xl p-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-zepmeds-purple-transparent">
                <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />
              </div>
              <div>
                <h3 className="text-white font-medium">Exclusive Offer</h3>
                <p className="text-gray-400 text-sm">Use code ZEPMEDS for 20% off</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
