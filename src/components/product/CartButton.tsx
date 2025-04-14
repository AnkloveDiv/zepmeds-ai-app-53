
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus } from "lucide-react";

interface CartButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isAnimating: boolean;
  disabled?: boolean;
  showStepper: boolean;
  quantity?: number;
}

const CartButton = ({ 
  onClick,
  isAnimating,
  disabled = false,
  showStepper,
  quantity = 1
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

  useEffect(() => {
    if (isAnimating) {
      addFloatingElement();
    }
  }, [isAnimating, quantity]);

  return (
    <div className="relative">
      <motion.button
        className={`p-2 rounded-full ${disabled ? 'bg-gray-700' : 'bg-zepmeds-purple'} ${isAnimating ? 'cart-animation' : ''} cart-icon-button`}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        disabled={disabled}
      >
        {showStepper ? (
          <Plus className="w-4 h-4 text-white" />
        ) : (
          <ShoppingCart className="w-4 h-4 text-white" />
        )}
      </motion.button>
      
      {floatingElements.map(id => (
        <div key={id} className="float-animation absolute -top-4 -right-4">
          <div className="h-6 w-6 rounded-full bg-zepmeds-purple flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartButton;
