
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  animateQuantity: boolean;
}

const QuantityStepper = ({
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  animateQuantity
}: QuantityStepperProps) => {
  return (
    <motion.div 
      className="stepper-container"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between px-2">
        <motion.button 
          className="w-8 h-8 flex items-center justify-center text-white"
          onClick={onDecrement}
          whileTap={{ scale: 0.9 }}
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
      
      <motion.button
        className="w-full mt-2 py-1 bg-zepmeds-purple text-white text-xs rounded-md flex items-center justify-center"
        onClick={onAddToCart}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart className="h-3 w-3 mr-1" />
        Add to Cart
      </motion.button>
    </motion.div>
  );
};

export default QuantityStepper;
