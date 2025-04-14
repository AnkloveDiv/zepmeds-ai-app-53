
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  animateQuantity: boolean;
  isLiquid?: boolean;
  isDevice?: boolean;
  strips?: number;
  onIncrementStrips?: (e: React.MouseEvent) => void;
  onDecrementStrips?: (e: React.MouseEvent) => void;
  unitsPerStrip?: number;
}

const QuantityStepper = ({
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  animateQuantity,
  isLiquid = false,
  isDevice = false,
  strips = 1,
  onIncrementStrips,
  onDecrementStrips,
  unitsPerStrip = 10
}: QuantityStepperProps) => {
  // Calculate total units based on medicine type
  const totalUnits = isLiquid || isDevice 
    ? quantity
    : quantity + (strips * unitsPerStrip);

  return (
    <motion.div 
      className="stepper-container space-y-4"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Primary Quantity Control */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">
            {isLiquid ? "Bottles" : isDevice ? "Units" : "Tablets"}
          </span>
        </div>
        
        <div className="flex items-center justify-between px-2 bg-gray-800/70 rounded-md">
          <motion.button 
            className="w-8 h-8 flex items-center justify-center text-white"
            onClick={onDecrement}
            whileTap={{ scale: 0.9 }}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          
          <motion.span 
            className="text-white text-sm font-medium mx-2"
            animate={animateQuantity ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {quantity}
          </motion.span>
          
          <motion.button 
            className="w-8 h-8 flex items-center justify-center text-white"
            onClick={onIncrement}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Strips Control (for tablets only) */}
      {!isLiquid && !isDevice && onIncrementStrips && onDecrementStrips && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">Strips</span>
          </div>
          
          <div className="flex items-center justify-between px-2 bg-gray-800/70 rounded-md">
            <motion.button 
              className="w-8 h-8 flex items-center justify-center text-white"
              onClick={onDecrementStrips}
              whileTap={{ scale: 0.9 }}
              disabled={strips <= 1}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            
            <motion.span 
              className="text-white text-sm font-medium mx-2"
            >
              {strips}
            </motion.span>
            
            <motion.button 
              className="w-8 h-8 flex items-center justify-center text-white"
              onClick={onIncrementStrips}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Total units calculation */}
      <div className="mt-3 pt-2 border-t border-gray-700/50">
        <p className="text-gray-300 text-xs flex justify-between">
          <span>Total {isLiquid ? 'volume' : 'units'}:</span>
          <span className="font-medium">
            {isLiquid ? `${quantity * 100}mL` : totalUnits} 
            {isDevice ? ' units' : isLiquid ? '' : ' tablets'}
          </span>
        </p>
      </div>
      
      {/* Add to Cart Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-grow">
          <p className="text-gray-300 text-xs mb-1">Total Price</p>
          <p className="text-white font-semibold text-lg">₹{(quantity * 10).toFixed(2)}</p>
        </div>
        
        <motion.button
          className="w-auto px-4 py-3 bg-zepmeds-purple text-white rounded-md flex items-center justify-center font-medium"
          onClick={onAddToCart}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuantityStepper;
