
import { ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

const OfferBanner = () => {
  return (
    <div className="mt-8 mb-20">
      <h2 className="text-lg font-semibold text-white mb-3">Special Offers</h2>
      <motion.div 
        className="glass-morphism rounded-xl p-4 overflow-hidden relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zepmeds-purple/20 to-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-purple-500/20">
              <Heart className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-white font-medium">Heart Health Week</h3>
              <p className="text-gray-400 text-sm">30% off on BP monitors</p>
            </div>
          </div>
          
          <Badge className="bg-purple-500">NEW</Badge>
        </div>
      </motion.div>
    </div>
  );
};

export default OfferBanner;
