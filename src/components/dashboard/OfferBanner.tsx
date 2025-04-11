
import { ShoppingBag, ChevronRight, Pill, CreditCard, Truck, Clock, Gift, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OfferBanner = () => {
  const navigate = useNavigate();
  
  const offers = [
    {
      title: "Exclusive Offers",
      description: "Use code ZEPMEDS for 20% off",
      icon: <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />,
      bgClass: "bg-zepmeds-purple-transparent",
      path: "/coupons"
    },
    {
      title: "Cashback on Card Payments",
      description: "Get 5% cashback with any card",
      icon: <CreditCard className="h-6 w-6 text-green-400" />,
      bgClass: "bg-green-500/20",
      path: "/offers"
    },
    {
      title: "Buy Now, Pay Later",
      description: "Zero interest EMI available",
      icon: <Clock className="h-6 w-6 text-amber-400" />,
      bgClass: "bg-amber-500/20",
      path: "/offers"
    },
    {
      title: "Free Express Delivery",
      description: "On orders above ₹500",
      icon: <Truck className="h-6 w-6 text-blue-400" />,
      bgClass: "bg-blue-500/20",
      path: "/offers"
    }
  ];
  
  const handleOfferClick = (path) => {
    navigate(path);
  };
  
  return (
    <section className="mt-8 mb-4">
      <h2 className="text-lg font-semibold text-white mb-3">Special Offers</h2>
      
      <div className="space-y-3">
        {offers.map((offer, index) => (
          <motion.div 
            key={index}
            className="glass-morphism rounded-xl p-4 overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOfferClick(offer.path)}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zepmeds-purple/20 to-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className={`mr-4 p-3 rounded-full ${offer.bgClass}`}>
                  {offer.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{offer.title}</h3>
                  <p className="text-gray-400 text-sm">{offer.description}</p>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OfferBanner;
