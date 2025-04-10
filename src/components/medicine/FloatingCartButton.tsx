
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  itemsCount: number;
  onClick: () => void;
}

const FloatingCartButton = ({ itemsCount, onClick }: FloatingCartButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 z-20"
    >
      <button 
        className="w-14 h-14 rounded-full bg-zepmeds-purple flex items-center justify-center shadow-lg"
        onClick={onClick}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {itemsCount}
          </span>
        )}
      </button>
    </motion.div>
  );
};

export default FloatingCartButton;
