
import { ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OfferBanner = () => {
  const navigate = useNavigate();
  
  const handleOfferClick = () => {
    navigate("/coupons");
  };
  
  return (
    <section className="mt-8 mb-4">
      <h2 className="text-lg font-semibold text-white mb-3">Special Offers</h2>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4 overflow-hidden relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOfferClick}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zepmeds-purple/20 to-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-zepmeds-purple-transparent">
              <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />
            </div>
            <div>
              <h3 className="text-white font-medium">Exclusive Offers</h3>
              <p className="text-gray-400 text-sm">Use code ZEPMEDS for 20% off</p>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </motion.div>
    </section>
  );
};

export default OfferBanner;
