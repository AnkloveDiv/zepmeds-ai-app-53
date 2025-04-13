
import React, { useState, useEffect } from "react";
import { Plus, Minus, Droplets, Pill, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  strips: number;
  setStrips: React.Dispatch<React.SetStateAction<number>>;
  isLiquid: boolean;
  isDevice: boolean;
  handleDecrement: (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => void;
  handleIncrement: (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => void;
  disabled?: boolean;
  medicineType?: "tablets" | "liquid" | "device";
  unitsPerStrip?: number;
  totalQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  strips,
  setStrips,
  isLiquid,
  isDevice,
  handleDecrement,
  handleIncrement,
  disabled = false,
  medicineType = "tablets",
  unitsPerStrip = 10,
  totalQuantity
}) => {
  const [animateQuantity, setAnimateQuantity] = useState(false);
  const [animateStrips, setAnimateStrips] = useState(false);
  
  // Calculate total units
  const [totalUnits, setTotalUnits] = useState(quantity);
  
  useEffect(() => {
    if (medicineType === "tablets") {
      setTotalUnits(quantity + (strips * unitsPerStrip));
    } else {
      setTotalUnits(quantity);
    }
  }, [quantity, strips, medicineType, unitsPerStrip]);

  const triggerQuantityAnimation = () => {
    setAnimateQuantity(true);
    setTimeout(() => setAnimateQuantity(false), 300);
  };

  const triggerStripsAnimation = () => {
    setAnimateStrips(true);
    setTimeout(() => setAnimateStrips(false), 300);
  };

  const handleQuantityDecrement = () => {
    if (!disabled && quantity > 1) {
      handleDecrement(setQuantity, quantity);
      triggerQuantityAnimation();
    }
  };

  const handleQuantityIncrement = () => {
    if (!disabled) {
      handleIncrement(setQuantity, quantity);
      triggerQuantityAnimation();
    }
  };

  const handleStripsDecrement = () => {
    if (!disabled && strips > 1) {
      handleDecrement(setStrips, strips);
      triggerStripsAnimation();
    }
  };

  const handleStripsIncrement = () => {
    if (!disabled) {
      handleIncrement(setStrips, strips);
      triggerStripsAnimation();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-medium">Quantity</h3>
        
        {medicineType === "tablets" && (
          <div className="text-gray-400 text-xs flex items-center">
            <Pill className="h-3 w-3 mr-1" />
            {unitsPerStrip} tablets per strip
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <div className={`flex items-center justify-between ${disabled ? 'bg-gray-900/30' : 'bg-gray-900/50'} border ${disabled ? 'border-gray-900' : 'border-gray-800'} rounded-md px-3 py-2`}>
            <motion.button 
              className={`p-1 rounded-full ${disabled ? 'text-gray-600 cursor-not-allowed' : 'text-white'}`}
              onClick={handleQuantityDecrement}
              disabled={disabled}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            
            <motion.span 
              className={`${disabled ? 'text-gray-500' : 'text-white'} text-sm`}
              animate={animateQuantity ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {quantity}
            </motion.span>
            
            <motion.button 
              className={`p-1 rounded-full ${disabled ? 'text-gray-600 cursor-not-allowed' : 'text-white'}`}
              onClick={handleQuantityIncrement}
              disabled={disabled}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {isDevice ? (
              <span className="flex items-center">
                <Stethoscope className="h-3 w-3 mr-1" /> Units
              </span>
            ) : isLiquid ? (
              <span className="flex items-center">
                <Droplets className="h-3 w-3 mr-1" /> Bottles
              </span>
            ) : (
              <span className="flex items-center">
                <Pill className="h-3 w-3 mr-1" /> Tablets
              </span>
            )}
          </p>
        </div>
      
        {!isLiquid && !isDevice && (
          <div className="flex-1">
            <div className={`flex items-center justify-between ${disabled ? 'bg-gray-900/30' : 'bg-gray-900/50'} border ${disabled ? 'border-gray-900' : 'border-gray-800'} rounded-md px-3 py-2`}>
              <motion.button 
                className={`p-1 rounded-full ${disabled ? 'text-gray-600 cursor-not-allowed' : 'text-white'}`}
                onClick={handleStripsDecrement}
                disabled={disabled}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              
              <motion.span 
                className={`${disabled ? 'text-gray-500' : 'text-white'} text-sm`}
                animate={animateStrips ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {strips}
              </motion.span>
              
              <motion.button 
                className={`p-1 rounded-full ${disabled ? 'text-gray-600 cursor-not-allowed' : 'text-white'}`}
                onClick={handleStripsIncrement}
                disabled={disabled}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
            <p className="text-gray-400 text-xs mt-1 flex items-center">
              <Pill className="h-3 w-3 mr-1" /> Strip(s)
            </p>
          </div>
        )}
      </div>
      
      {/* Total calculation summary */}
      <div className="mt-3 pt-2 border-t border-gray-800">
        <p className="text-gray-300 text-xs flex justify-between">
          <span>Total {isLiquid ? 'volume' : 'units'}:</span>
          <span className="font-medium">
            {isLiquid ? `${quantity * 100}mL` : totalUnits} 
            {isDevice ? ' units' : isLiquid ? '' : ' tablets'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuantitySelector;
