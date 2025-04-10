
import { motion } from "framer-motion";

interface CategoryCardProps {
  icon: React.ReactNode;
  name: string;
  gradient: string;
  onClick?: () => void;
}

const CategoryCard = ({ icon, name, gradient, onClick }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
        style={{ 
          background: gradient,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" 
        }}
      >
        {icon}
      </div>
      <span className="text-sm text-white text-center font-medium">{name}</span>
    </motion.div>
  );
};

export default CategoryCard;
