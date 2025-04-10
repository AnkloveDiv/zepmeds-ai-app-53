
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryCard from "@/components/CategoryCard";
import { Heart, Pill, Eye, Stethoscope, Bone, Brain, Sun, Thermometer } from "lucide-react";

const categories = [
  { name: "Skin Care", icon: <Heart className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF6B6B, #FFD166)", onClick: () => {} },
  { name: "Supplements", icon: <Pill className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #4E65FF, #92EFFD)", onClick: () => {} },
  { name: "Eye Care", icon: <Eye className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #33D9B2, #00B5AA)", onClick: () => {} },
  { name: "Dental", icon: <Stethoscope className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #706FD3, #98D9EA)", onClick: () => {} },
  { name: "Pain Relief", icon: <Bone className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF5E3A, #FF9E80)", onClick: () => {} },
  { name: "Brain", icon: <Brain className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #6A5ACD, #A17FE0)", onClick: () => {} },
  { name: "Summer Care", icon: <Sun className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #FF9E2C, #FFD66B)", onClick: () => {} },
  { name: "Devices", icon: <Thermometer className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #4776E6, #8E54E9)", onClick: () => {} }
];

const CategorySection = () => {
  const navigate = useNavigate();

  // Create a wrapped category array with navigation
  const categoriesWithNavigation = categories.map(category => ({
    ...category,
    onClick: () => navigate(`/medicine-delivery?category=${category.name.toLowerCase().replace(/\s+/g, '')}`)
  }));

  return (
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
          {categoriesWithNavigation.map((category, index) => (
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
  );
};

export default CategorySection;
