
import React from "react";
import { Droplets, ThermometerSun, Pill } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  strips: number;
  setStrips: React.Dispatch<React.SetStateAction<number>>;
  isLiquid: boolean;
  isDevice: boolean;
  handleDecrement: (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => void;
  handleIncrement: (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  strips,
  setStrips,
  isLiquid,
  isDevice,
  handleDecrement,
  handleIncrement
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {isLiquid ? (
        <div>
          <label className="text-sm text-gray-300 mb-2 block flex items-center">
            <Droplets className="h-4 w-4 mr-1" />
            Volume (ml)
          </label>
          <div className="flex items-center">
            <button 
              className="w-8 h-8 rounded-l-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleDecrement(setQuantity, quantity)}
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 h-8 bg-black/20 text-white text-center border-none"
            />
            <button 
              className="w-8 h-8 rounded-r-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleIncrement(setQuantity, quantity)}
            >
              +
            </button>
          </div>
        </div>
      ) : isDevice ? (
        <div>
          <label className="text-sm text-gray-300 mb-2 block flex items-center">
            <ThermometerSun className="h-4 w-4 mr-1" />
            Quantity
          </label>
          <div className="flex items-center">
            <button 
              className="w-8 h-8 rounded-l-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleDecrement(setQuantity, quantity)}
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 h-8 bg-black/20 text-white text-center border-none"
            />
            <button 
              className="w-8 h-8 rounded-r-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleIncrement(setQuantity, quantity)}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm text-gray-300 mb-2 block flex items-center">
            <Pill className="h-4 w-4 mr-1" />
            Strips
          </label>
          <div className="flex items-center">
            <button 
              className="w-8 h-8 rounded-l-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleDecrement(setStrips, strips)}
            >
              -
            </button>
            <input 
              type="number" 
              value={strips}
              onChange={(e) => setStrips(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 h-8 bg-black/20 text-white text-center border-none"
            />
            <button 
              className="w-8 h-8 rounded-r-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              onClick={() => handleIncrement(setStrips, strips)}
            >
              +
            </button>
          </div>
        </div>
      )}
      
      <div>
        <label className="text-sm text-gray-300 mb-2 block">Quantity</label>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 rounded-l-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            onClick={() => handleDecrement(setQuantity, quantity)}
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 h-8 bg-black/20 text-white text-center border-none"
          />
          <button 
            className="w-8 h-8 rounded-r-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            onClick={() => handleIncrement(setQuantity, quantity)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
