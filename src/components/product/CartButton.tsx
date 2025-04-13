
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus } from "lucide-react";

interface CartButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isAnimating: boolean;
  disabled?: boolean;
  showStepper: boolean;
}

const CartButton = ({ 
  onClick,
  isAnimating,
  disabled = false,
  showStepper
}: CartButtonProps) => {
  const [floatingElements, setFloatingElements] = useState<number[]>([]);

  const addFloatingElement = () => {
    const id = Date.now();
    setFloatingElements(prev => [...prev, id]);
    
    // Remove floating element after animation completes
    setTimeout(() => {
      setFloatingElements(prev => prev.filter(item => item !== id));
    }, 1000);
  };

  return (
    <div className="relative">
      <motion.button
        className={`p-2 rounded-full ${disabled ? 'bg-gray-700' : 'bg-zepmeds-purple'} ${isAnimating ? 'cart-animation' : ''} cart-icon-button`}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
      >
        {showStepper ? (
          <Plus className="w-4 h-4 text-white" />
        ) : (
          <ShoppingCart className="w-4 h-4 text-white" />
        )}
      </motion.button>
      
      {floatingElements.map(id => (
        <div key={id} className="float-animation">
          <Plus className="w-4 h-4 text-white" />
        </div>
      ))}
    </div>
  );
};

export default CartButton;
