
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  handleAddToCart: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onClose, handleAddToCart }) => {
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
        className="flex-1 bg-zepmeds-purple hover:bg-zepmeds-purple/80"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ActionButtons;
