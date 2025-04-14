
import { motion } from "framer-motion";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";

interface ActionButtonsProps {
  onClose: () => void;
  handleAddToCart: () => void;
  disabled?: boolean;
  inStock?: boolean;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isLiquid?: boolean;
  isDevice?: boolean;
  strips?: number;
  setStrips?: (strips: number) => void;
  unitsPerStrip?: number;
}

const ActionButtons = ({ 
  onClose, 
  handleAddToCart, 
  disabled = false,
  inStock = true,
  quantity,
  setQuantity,
  isLiquid = false,
  isDevice = false,
  strips = 1,
  setStrips,
  unitsPerStrip = 10
}: ActionButtonsProps) => {
  const [animateQuantity, setAnimateQuantity] = useState(false);
  const [animateStrips, setAnimateStrips] = useState(false);
  
  // Calculate total units
  const totalUnits = isLiquid || isDevice 
    ? quantity 
    : quantity + (strips * unitsPerStrip);

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
    setAnimateQuantity(true);
    setTimeout(() => setAnimateQuantity(false), 300);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setAnimateQuantity(true);
      setTimeout(() => setAnimateQuantity(false), 300);
    }
  };

  const incrementStrips = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setStrips) {
      setStrips(strips + 1);
      setAnimateStrips(true);
      setTimeout(() => setAnimateStrips(false), 300);
    }
  };

  const decrementStrips = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setStrips && strips > 1) {
      setStrips(strips - 1);
      setAnimateStrips(true);
      setTimeout(() => setAnimateStrips(false), 300);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex flex-col gap-3">
        {/* Primary quantity control */}
        <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-2">
          <span className="text-white font-medium pl-2">
            {isLiquid ? "Bottles" : isDevice ? "Units" : "Tablets"}
          </span>
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || disabled || !inStock}
            >
              <Minus size={16} />
            </motion.button>
            <motion.span 
              className="w-10 text-center text-white"
              animate={animateQuantity ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {quantity}
            </motion.span>
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
        
        {/* Strip quantity control (for tablets only) */}
        {!isLiquid && !isDevice && setStrips && (
          <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-2">
            <span className="text-white font-medium pl-2">Strips</span>
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white"
                onClick={decrementStrips}
                disabled={strips <= 1 || disabled || !inStock}
              >
                <Minus size={16} />
              </motion.button>
              <motion.span 
                className="w-10 text-center text-white"
                animate={animateStrips ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {strips}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white"
                onClick={incrementStrips}
                disabled={disabled || !inStock}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </div>
        )}
        
        {/* Total calculation summary */}
        <div className="px-2 py-1 border-t border-gray-800">
          <p className="text-gray-300 text-xs flex justify-between">
            <span>Total {isLiquid ? 'volume' : 'units'}:</span>
            <span className="font-medium">
              {isLiquid ? `${quantity * 100}mL` : totalUnits} 
              {isDevice ? ' units' : isLiquid ? '' : ' tablets'}
            </span>
          </p>
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
