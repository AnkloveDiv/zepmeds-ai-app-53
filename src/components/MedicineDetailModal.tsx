
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Pill, Clock, Truck, ShieldCheck, Info, Beaker, ThermometerSun, CircleHelp, Factory, ScrollText, ArrowRight, Droplets } from "lucide-react";
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
    saltComposition?: string;
    howItWorks?: string;
    directions?: string;
    quickTips?: string[];
    faqs?: { question: string; answer: string }[];
    category?: string;
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
  const [activeTab, setActiveTab] = React.useState("description");

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && medicine) {
      setQuantity(1);
      setStrips(1);
      setActiveTab("description");
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

  const isLiquid = medicine.name.toLowerCase().includes("solution") || 
                  medicine.name.toLowerCase().includes("gel") || 
                  medicine.name.toLowerCase().includes("drops") ||
                  medicine.name.toLowerCase().includes("cream") ||
                  medicine.name.toLowerCase().includes("lotion");
                  
  const isDevice = medicine.name.toLowerCase().includes("monitor") || 
                  medicine.name.toLowerCase().includes("thermometer") ||
                  medicine.name.toLowerCase().includes("glasses");

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
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
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
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
                  <Factory className="h-4 w-4 text-zepmeds-purple" />
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
              
              <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-none">
                <button
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeTab === "description"
                      ? "bg-zepmeds-purple text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeTab === "directions"
                      ? "bg-zepmeds-purple text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                  onClick={() => setActiveTab("directions")}
                >
                  Directions
                </button>
                <button
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeTab === "howItWorks"
                      ? "bg-zepmeds-purple text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                  onClick={() => setActiveTab("howItWorks")}
                >
                  How it Works
                </button>
                <button
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeTab === "quickTips"
                      ? "bg-zepmeds-purple text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                  onClick={() => setActiveTab("quickTips")}
                >
                  Quick Tips
                </button>
                <button
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeTab === "faqs"
                      ? "bg-zepmeds-purple text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                  onClick={() => setActiveTab("faqs")}
                >
                  FAQs
                </button>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-black/20 min-h-[150px]">
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-300">{medicine.fullDescription || medicine.description || "No description available."}</p>
                    
                    {medicine.saltComposition && (
                      <div className="mt-4">
                        <h4 className="text-white text-sm font-medium mb-1">Salt Composition:</h4>
                        <p className="text-sm text-gray-300">{medicine.saltComposition}</p>
                      </div>
                    )}
                    
                    {medicine.ingredients && medicine.ingredients.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-white text-sm font-medium mb-1">Ingredients:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                          {medicine.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {medicine.sideEffects && medicine.sideEffects.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-white text-sm font-medium mb-1">Side Effects:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                          {medicine.sideEffects.map((effect, idx) => (
                            <li key={idx}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "directions" && (
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                      <ScrollText className="h-4 w-4" />
                      Directions of Use
                    </h3>
                    <p className="text-sm text-gray-300">
                      {medicine.directions || medicine.dosage || "Take as directed by your physician."}
                    </p>
                  </div>
                )}
                
                {activeTab === "howItWorks" && (
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                      {isLiquid ? (
                        <Droplets className="h-4 w-4" />
                      ) : isDevice ? (
                        <ThermometerSun className="h-4 w-4" />
                      ) : (
                        <Pill className="h-4 w-4" />
                      )}
                      How it Works
                    </h3>
                    <p className="text-sm text-gray-300">
                      {medicine.howItWorks || (isLiquid 
                        ? "This solution works by direct application to the affected area to provide relief." 
                        : isDevice 
                          ? "This device helps monitor and track your health metrics with precision." 
                          : "This medicine works by targeting specific receptors in the body to provide relief.")}
                    </p>
                  </div>
                )}
                
                {activeTab === "quickTips" && (
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                      <ArrowRight className="h-4 w-4" />
                      Quick Tips
                    </h3>
                    {medicine.quickTips && medicine.quickTips.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-300">
                        {medicine.quickTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside text-sm text-gray-300">
                        <li>Store in a cool, dry place away from direct sunlight</li>
                        <li>Keep out of reach of children</li>
                        <li>Do not use after expiry date</li>
                        {isLiquid && <li>Shake well before use</li>}
                      </ul>
                    )}
                  </div>
                )}
                
                {activeTab === "faqs" && (
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                      <CircleHelp className="h-4 w-4" />
                      Frequently Asked Questions
                    </h3>
                    {medicine.faqs && medicine.faqs.length > 0 ? (
                      <div className="space-y-3">
                        {medicine.faqs.map((faq, idx) => (
                          <div key={idx}>
                            <h4 className="text-white text-sm font-medium">{faq.question}</h4>
                            <p className="text-sm text-gray-300">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-white text-sm font-medium">Is this medicine safe for long-term use?</h4>
                          <p className="text-sm text-gray-300">Consult with your doctor for long-term use recommendations.</p>
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-medium">Can I take this with other medications?</h4>
                          <p className="text-sm text-gray-300">Always inform your doctor about all medications you are taking.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 my-5"></div>
              
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
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedicineDetailModal;
