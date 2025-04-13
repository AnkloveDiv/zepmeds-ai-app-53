
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  handleAddToCart: () => void;
  disabled?: boolean;
  inStock?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onClose, 
  handleAddToCart, 
  disabled = false,
  inStock = true
}) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="secondary" 
        className="flex-1"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button 
        className={`flex-1 ${inStock ? 'bg-zepmeds-purple hover:bg-zepmeds-purple/80' : 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed'}`}
        onClick={handleAddToCart}
        disabled={disabled}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </div>
  );
};

export default ActionButtons;
