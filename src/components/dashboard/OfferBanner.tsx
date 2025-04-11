
import { ShoppingBag, ChevronRight, Pill, CreditCard, Truck, Clock, Gift, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const OfferBanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const offers = [
    {
      title: "Exclusive Offers",
      description: "Use code ZEPMEDS for 20% off",
      icon: <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />,
      bgClass: "bg-zepmeds-purple-transparent",
      path: "/coupons",
      buttonColor: "bg-zepmeds-purple hover:bg-zepmeds-purple/90",
      buttonIcon: <Gift className="h-4 w-4 mr-2" />
    },
    {
      title: "Cashback on Card Payments",
      description: "Get 5% cashback with any card",
      icon: <CreditCard className="h-6 w-6 text-green-400" />,
      bgClass: "bg-green-500/20",
      path: "/offers",
      buttonColor: "bg-green-500 hover:bg-green-600",
      buttonIcon: <CreditCard className="h-4 w-4 mr-2" />
    },
    {
      title: "Buy Now, Pay Later",
      description: "Zero interest EMI available",
      icon: <Clock className="h-6 w-6 text-amber-400" />,
      bgClass: "bg-amber-500/20",
      path: "/offers",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      buttonIcon: <Clock className="h-4 w-4 mr-2" />
    },
    {
      title: "Free Express Delivery",
      description: "On orders above ₹500",
      icon: <Truck className="h-6 w-6 text-blue-400" />,
      bgClass: "bg-blue-500/20",
      path: "/medicine-delivery",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      buttonIcon: <Truck className="h-4 w-4 mr-2" />
    }
  ];
  
  const handleOfferClick = (path: string, title: string) => {
    navigate(path);
    toast({
      title: "Offer Selected",
      description: `You've selected the "${title}" offer.`,
      duration: 3000,
    });
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
              
              <Button 
                size="sm" 
                className={`flex items-center ${offer.buttonColor}`}
                onClick={() => handleOfferClick(offer.path, offer.title)}
              >
                {offer.buttonIcon}
                Shop Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OfferBanner;
