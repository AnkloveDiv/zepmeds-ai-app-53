
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
    
  const totalPrice = (quantity * 10).toFixed(2);

  return (
    <div className="space-y-6 mt-4">
      {/* Product Type Sections */}
      <div className="space-y-4">
        {/* Tablets/Bottles/Units Section */}
        <div>
          <div className="text-white text-base font-medium mb-2">
            {isLiquid ? "Bottles" : isDevice ? "Units" : "Tablets"}
          </div>
          
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/70 rounded-lg">
            <motion.button 
              className="w-8 h-8 flex items-center justify-center text-white"
              onClick={onDecrement}
              whileTap={{ scale: 0.9 }}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            
            <motion.span 
              className="text-white text-base font-medium mx-2"
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
        
        {/* Strips Section (for tablets only) */}
        {!isLiquid && !isDevice && onIncrementStrips && onDecrementStrips && (
          <div>
            <div className="text-white text-base font-medium mb-2">
              Strips
            </div>
            
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/70 rounded-lg">
              <motion.button 
                className="w-8 h-8 flex items-center justify-center text-white"
                onClick={onDecrementStrips}
                whileTap={{ scale: 0.9 }}
                disabled={strips <= 1}
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              
              <motion.span 
                className="text-white text-base font-medium mx-2"
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
      </div>
      
      {/* Total units calculation */}
      <div className="pb-3 border-b border-gray-700/50">
        <p className="text-gray-300 text-sm flex justify-between">
          <span>Total {isLiquid ? 'volume' : 'units'}:</span>
          <span className="font-medium">
            {isLiquid ? `${quantity * 100}mL` : totalUnits} 
            {isDevice ? ' units' : isLiquid ? '' : ' tablets'}
          </span>
        </p>
      </div>
      
      {/* Price and Add to Cart Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-xs">Total Price</p>
          <p className="text-white font-semibold text-lg">₹{totalPrice}</p>
        </div>
        
        <motion.button
          className="bg-zepmeds-purple text-white rounded-lg px-6 py-3 flex items-center justify-center font-medium"
          onClick={onAddToCart}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </div>
  );
};

export default QuantityStepper;
