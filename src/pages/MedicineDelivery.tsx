
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import {
  MapPin,
  Cloud,
  FileUp,
  Filter,
  Heart,
  Brain,
  Eye,
  Tooth,
  Bone,
  Sun,
  Pill,
  ShoppingCart
} from "lucide-react";

const placeholderImg = "/placeholder.svg";

const MedicineDelivery = () => {
  const navigate = useNavigate();
  const [location] = useState("Current Location");
  const [temperature] = useState("28°C");
  const [weather] = useState("Sunny");

  const categories = [
    { name: "All", icon: <Pill className="h-5 w-5" />, active: true },
    { name: "Popular", icon: <Heart className="h-5 w-5" />, active: false },
    { name: "Brain", icon: <Brain className="h-5 w-5" />, active: false },
    { name: "Eye Care", icon: <Eye className="h-5 w-5" />, active: false },
    { name: "Dental", icon: <Tooth className="h-5 w-5" />, active: false },
    { name: "Pain", icon: <Bone className="h-5 w-5" />, active: false },
    { name: "Summer", icon: <Sun className="h-5 w-5" />, active: false }
  ];

  const products = [
    { name: "Vitamin C Tablets", image: placeholderImg, price: 350, discountPrice: 280, rating: 4.5, description: "Immunity Booster" },
    { name: "Digital Thermometer", image: placeholderImg, price: 500, discountPrice: 399, rating: 4.2, description: "Accurate Reading" },
    { name: "Pain Relief Gel", image: placeholderImg, price: 220, discountPrice: null, rating: 4.0, description: "Fast Relief" },
    { name: "Multivitamin Capsules", image: placeholderImg, price: 450, discountPrice: 410, rating: 4.7, description: "Daily Nutrition" },
    { name: "Blood Pressure Monitor", image: placeholderImg, price: 1800, discountPrice: 1499, rating: 4.3, description: "Digital Monitor" },
    { name: "Hand Sanitizer", image: placeholderImg, price: 150, discountPrice: 120, rating: 4.1, description: "99.9% Germ Protection" }
  ];

  const handleUploadPrescription = () => {
    // Handle prescription upload
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Medicine Delivery" />

      <main className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
            <span className="text-sm text-white mr-2">{location}</span>
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
                  category.active
                    ? "bg-zepmeds-purple text-white"
                    : "bg-black/20 border border-white/10 text-gray-300"
                }`}
              >
                <span className={category.active ? "text-white" : "text-gray-400"}>
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
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
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 z-20"
        >
          <button className="w-14 h-14 rounded-full bg-zepmeds-purple flex items-center justify-center shadow-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MedicineDelivery;
