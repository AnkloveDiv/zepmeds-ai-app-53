
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";
import {
  MapPin,
  Cloud,
  FileUp,
  Filter,
  Heart,
  Brain,
  Eye,
  Stethoscope as DentalIcon,
  Bone,
  Sun,
  Pill,
  ShoppingCart
} from "lucide-react";

// Use actual images for products
const vitaminCImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const thermometerImg = "https://images.unsplash.com/photo-1588613254750-bc14209ae7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const painReliefImg = "https://images.unsplash.com/photo-1558956546-130eb5b8ba93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const multivitaminImg = "https://images.unsplash.com/photo-1579165466741-7f35e4755183?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const bpMonitorImg = "https://images.unsplash.com/photo-1631815588090-d4bfec5b9a1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const sanitizerImg = "https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const eyeDropsImg = "https://images.unsplash.com/photo-1616668983570-a971f3e35c62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const dentalFlossImg = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const sunscreenImg = "https://images.unsplash.com/photo-1521223619409-8071a04a1b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const memorySupplementImg = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const readingGlassesImg = "https://images.unsplash.com/photo-1483412468200-72182a492cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const musclePainImg = "https://images.unsplash.com/photo-1616091238995-af68d2711aec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

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
  
  // Use our custom hook for back navigation
  useBackNavigation();

  const categories = [
    { name: "All", icon: <Pill className="h-5 w-5" /> },
    { name: "Popular", icon: <Heart className="h-5 w-5" /> },
    { name: "Brain", icon: <Brain className="h-5 w-5" /> },
    { name: "Eye Care", icon: <Eye className="h-5 w-5" /> },
    { name: "Dental", icon: <DentalIcon className="h-5 w-5" /> },
    { name: "Pain", icon: <Bone className="h-5 w-5" /> },
    { name: "Summer", icon: <Sun className="h-5 w-5" /> }
  ];

  const allProducts = [
    { id: "1", name: "Vitamin C Tablets", image: vitaminCImg, price: 350, discountPrice: 280, rating: 4.5, description: "Immunity Booster", category: "Popular" },
    { id: "2", name: "Digital Thermometer", image: thermometerImg, price: 500, discountPrice: 399, rating: 4.2, description: "Accurate Reading", category: "Summer" },
    { id: "3", name: "Pain Relief Gel", image: painReliefImg, price: 220, discountPrice: null, rating: 4.0, description: "Fast Relief", category: "Pain" },
    { id: "4", name: "Multivitamin Capsules", image: multivitaminImg, price: 450, discountPrice: 410, rating: 4.7, description: "Daily Nutrition", category: "Popular" },
    { id: "5", name: "Blood Pressure Monitor", image: bpMonitorImg, price: 1800, discountPrice: 1499, rating: 4.3, description: "Digital Monitor", category: "Brain" },
    { id: "6", name: "Hand Sanitizer", image: sanitizerImg, price: 150, discountPrice: 120, rating: 4.1, description: "99.9% Germ Protection", category: "Popular" },
    { id: "7", name: "Eye Drops", image: eyeDropsImg, price: 180, discountPrice: 150, rating: 4.2, description: "Relieves Dryness", category: "Eye Care" },
    { id: "8", name: "Dental Floss", image: dentalFlossImg, price: 120, discountPrice: null, rating: 4.0, description: "Complete Care", category: "Dental" },
    { id: "9", name: "Sunscreen Lotion", image: sunscreenImg, price: 280, discountPrice: 250, rating: 4.6, description: "SPF 50+", category: "Summer" },
    { id: "10", name: "Memory Supplement", image: memorySupplementImg, price: 450, discountPrice: 399, rating: 4.3, description: "Cognitive Support", category: "Brain" },
    { id: "11", name: "Reading Glasses", image: readingGlassesImg, price: 800, discountPrice: 650, rating: 4.1, description: "Anti-Glare", category: "Eye Care" },
    { id: "12", name: "Muscle Pain Cream", image: musclePainImg, price: 190, discountPrice: 160, rating: 4.4, description: "Fast Acting", category: "Pain" }
  ];

  useEffect(() => {
    // Get cart items from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Check for category from URL params
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    
    if (categoryParam) {
      // Map URL parameter to actual category
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
    setCartItems(existingCart);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medicine Delivery" cartCount={cartItems.length} />

      <main className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
            <span className="text-sm text-white mr-2">{userLocation}</span>
          </div>
          <div className="flex items-center text-sm text-white">
            <Cloud className="h-4 w-4 text-blue-400 mr-1" />
            <span>{temperature}</span>
            <span className="ml-1 text-gray-400">({weather})</span>
          </div>
        </div>

        <SearchBar placeholder="Search for medicines, health products..." />

        <div className="flex justify-between items-center mt-6 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-zepmeds-purple text-white rounded-lg flex items-center"
            onClick={handleUploadPrescription}
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload Prescription
          </motion.button>

          <button className="p-2 rounded-lg bg-black/20 border border-white/10">
            <Filter className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto scrollbar-none -mx-4 px-4">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 rounded-full flex items-center space-x-1 min-w-max ${
                  category.name === activeCategory
                    ? "bg-zepmeds-purple text-white"
                    : "bg-black/20 border border-white/10 text-gray-300"
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className={category.name === activeCategory ? "text-white" : "text-gray-400"}>
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <ProductCard
                name={product.name}
                image={product.image}
                price={product.price}
                discountPrice={product.discountPrice}
                rating={product.rating}
                description={product.description}
                onAddToCart={() => handleAddToCart(product)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 z-20"
        >
          <button 
            className="w-14 h-14 rounded-full bg-zepmeds-purple flex items-center justify-center shadow-lg"
            onClick={handleViewCart}
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
