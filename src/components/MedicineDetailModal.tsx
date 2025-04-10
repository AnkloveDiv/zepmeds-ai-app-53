
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Pill, Clock, Truck, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: {
    id: string;
    name: string;
    image: string;
    price: number;
    discountPrice?: number;
    rating: number;
    description?: string;
    fullDescription?: string;
    manufacturer?: string;
    expiryDate?: string;
    dosage?: string;
    sideEffects?: string[];
    ingredients?: string[];
  } | null;
  onAddToCart: (quantity: number, strips: number) => void;
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  isOpen,
  onClose,
  medicine,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [strips, setStrips] = React.useState(1);

  React.useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  React.useEffect(() => {
    // Reset values when modal opens with new medicine
    if (isOpen && medicine) {
      setQuantity(1);
      setStrips(1);
    }
  }, [isOpen, medicine]);

  if (!medicine) return null;

  const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    if (current > 1) {
      setter(current - 1);
    }
  };

  const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    setter(current + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, strips);
    onClose();
  };

  const discount = medicine.discountPrice 
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100) 
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-background border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={medicine.image} 
                alt={medicine.name} 
                className="w-full h-48 object-cover rounded-t-xl"
              />
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {discount}% OFF
                </div>
              )}
              
              <button 
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-white">{medicine.name}</h2>
                <div className="flex items-center bg-zepmeds-purple/20 px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-xs text-white">{medicine.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{medicine.description}</p>
              
              <div className="flex items-baseline mb-4">
                {medicine.discountPrice ? (
                  <>
                    <span className="text-zepmeds-purple text-xl font-bold mr-2">₹{medicine.discountPrice}</span>
                    <span className="text-gray-400 text-sm line-through">₹{medicine.price}</span>
                  </>
                ) : (
                  <span className="text-zepmeds-purple text-xl font-bold">₹{medicine.price}</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-zepmeds-purple" />
                  <span className="text-sm text-gray-300">
                    {medicine.manufacturer || "Zepmeds"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zepmeds-purple" />
                  <span className="text-sm text-gray-300">
                    {medicine.expiryDate || "12 months validity"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-zepmeds-purple" />
                  <span className="text-sm text-gray-300">
                    Free Delivery
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-zepmeds-purple" />
                  <span className="text-sm text-gray-300">
                    100% Genuine
                  </span>
                </div>
              </div>
              
              {medicine.fullDescription && (
                <div className="mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="text-sm text-gray-300">{medicine.fullDescription}</p>
                </div>
              )}
              
              {medicine.dosage && (
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-2">Dosage Instructions</h3>
                  <p className="text-sm text-gray-300">{medicine.dosage}</p>
                </div>
              )}
              
              <div className="border-t border-gray-700 my-5"></div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Strips</label>
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineDetailModal;
