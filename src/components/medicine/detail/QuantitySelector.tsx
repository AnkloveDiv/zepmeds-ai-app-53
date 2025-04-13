
import React from "react";
import { Plus, Minus } from "lucide-react";

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
  disabled = false
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-sm font-medium mb-3">Quantity</h3>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-md px-3 py-2">
            <button 
              className={`p-1 rounded-full ${disabled ? 'text-gray-600' : 'text-white'}`}
              onClick={() => handleDecrement(setQuantity, quantity)}
              disabled={disabled}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-white text-sm">{quantity}</span>
            <button 
              className={`p-1 rounded-full ${disabled ? 'text-gray-600' : 'text-white'}`}
              onClick={() => handleIncrement(setQuantity, quantity)}
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {isDevice ? "Units" : isLiquid ? "Bottles" : "Tablets"}
          </p>
        </div>
      
        {!isLiquid && !isDevice && (
          <div className="flex-1">
            <div className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-md px-3 py-2">
              <button 
                className={`p-1 rounded-full ${disabled ? 'text-gray-600' : 'text-white'}`}
                onClick={() => handleDecrement(setStrips, strips)}
                disabled={disabled}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-white text-sm">{strips}</span>
              <button 
                className={`p-1 rounded-full ${disabled ? 'text-gray-600' : 'text-white'}`}
                onClick={() => handleIncrement(setStrips, strips)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Strip(s)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;
