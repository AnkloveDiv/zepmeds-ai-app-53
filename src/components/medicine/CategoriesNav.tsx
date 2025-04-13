
import { useState } from "react";
import { Pill, Heart, Brain, Eye, Stethoscope, Bone, Sun, Dog, Thermometer, Star } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryProps {
  activeCategory?: string;
  onCategoryClick?: (categoryName: string) => void;
}

const CategoriesNav = ({ 
  activeCategory = "All", 
  onCategoryClick = () => {} 
}: CategoryProps) => {
  const categories = [
    { name: "All", icon: <Pill className="h-5 w-5" /> },
    { name: "Popular", icon: <Star className="h-5 w-5" /> },
    { name: "Skin Care", icon: <Heart className="h-5 w-5" /> },
    { name: "Supplements", icon: <Pill className="h-5 w-5" /> },
    { name: "Eye Care", icon: <Eye className="h-5 w-5" /> },
    { name: "Dental", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Pain Relief", icon: <Bone className="h-5 w-5" /> },
    { name: "Summer Care", icon: <Sun className="h-5 w-5" /> },
    { name: "Pet Care", icon: <Dog className="h-5 w-5" /> },
    { name: "Devices", icon: <Thermometer className="h-5 w-5" /> }
  ];

  return (
    <div className="mt-4 overflow-x-auto scrollbar-none -mx-4 px-4">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <motion.button
            key={category.name}
            className={`px-4 py-2 rounded-full flex items-center space-x-1 min-w-max ${
              category.name === activeCategory
                ? "bg-zepmeds-purple text-white"
                : "bg-black/20 border border-white/10 text-gray-300"
            }`}
            onClick={() => onCategoryClick(category.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={category.name === activeCategory ? "text-white" : "text-gray-400"}>
              {category.icon}
            </span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesNav;
