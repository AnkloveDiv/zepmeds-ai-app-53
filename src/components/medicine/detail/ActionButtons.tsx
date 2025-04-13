
import { motion } from "framer-motion";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onClose: () => void;
  handleAddToCart: () => void;
  disabled?: boolean;
  inStock?: boolean;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ActionButtons = ({ 
  onClose, 
  handleAddToCart, 
  disabled = false,
  inStock = true,
  quantity,
  setQuantity
}: ActionButtonsProps) => {
  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-2 mb-2">
        <span className="text-white font-medium pl-2">Quantity</span>
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || disabled || !inStock}
          >
            <Minus size={16} />
          </motion.button>
          <span className="w-10 text-center text-white">{quantity}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white"
            onClick={incrementQuantity}
            disabled={disabled || !inStock}
          >
            <Plus size={16} />
          </motion.button>
        </div>
      </div>
      
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
    </div>
  );
};

export default ActionButtons;
