
import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

interface ActionButtonsProps {
  onClose: () => void;
  handleAddToCart: () => void;
  disabled?: boolean;
  inStock?: boolean;
}

const ActionButtons = ({ 
  onClose, 
  handleAddToCart, 
  disabled = false,
  inStock = true
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-3 bg-gray-800 text-white rounded-lg flex-1 flex items-center justify-center"
        onClick={onClose}
      >
        <X className="h-4 w-4 mr-2" />
        Close
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-3 rounded-lg flex-1 flex items-center justify-center ${
          disabled || !inStock ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-zepmeds-purple text-white'
        }`}
        onClick={handleAddToCart}
        disabled={disabled || !inStock}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </motion.button>
    </div>
  );
};

export default ActionButtons;
