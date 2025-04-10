
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ShoppingBag, Tag, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";

const Offers = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const [offers] = useState([
    {
      id: 1,
      title: "Weekend Special",
      discount: "20% OFF",
      description: "On all health supplements",
      validTill: "15 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?medicine"
    },
    {
      id: 2,
      title: "Summer Sale",
      discount: "FLAT ₹200 OFF",
      description: "On orders above ₹999",
      validTill: "30 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?pharmacy"
    },
    {
      id: 3,
      title: "Doctor Consultation",
      discount: "50% OFF",
      description: "On your first online consultation",
      validTill: "10 May 2025",
      image: "https://source.unsplash.com/random/400x200/?doctor"
    }
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Offers" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-6">
        <h2 className="text-xl font-bold text-white mb-5">Current Offers</h2>
        
        <div className="space-y-5">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism rounded-xl overflow-hidden"
            >
              <div className="relative h-40">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <div className="bg-zepmeds-purple text-white text-xl font-bold px-3 py-1 rounded-lg inline-block mb-2">
                    {offer.discount}
                  </div>
                  <h3 className="text-white text-xl font-bold">{offer.title}</h3>
                  <p className="text-gray-300">{offer.description}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Valid till {offer.validTill}</span>
                </div>
                
                <button className="flex items-center text-zepmeds-purple">
                  <span>Shop Now</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-5">Categories with Offers</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {['Medicine', 'Health Supplements', 'Personal Care', 'Medical Devices'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-xl p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mb-3">
                  <ShoppingBag className="h-6 w-6 text-zepmeds-purple" />
                </div>
                <h3 className="text-white font-medium mb-1">{category}</h3>
                <p className="text-xs text-gray-400">Up to 30% off</p>
                <button className="mt-3 text-xs text-zepmeds-purple flex items-center">
                  <span>View Offers</span>
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <div className="glass-morphism rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-1">Have a coupon code?</h3>
              <p className="text-sm text-gray-400">Redeem it during checkout</p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-zepmeds-purple/20 flex items-center justify-center">
              <Tag className="h-5 w-5 text-zepmeds-purple" />
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Offers;
