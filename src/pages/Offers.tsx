import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, ShoppingBag, Calendar, Clock, Gift, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Offer {
  id: string;
  title: string;
  description: string;
  expires: string;
  discount: string;
  image: string;
  type: "medicine" | "doctor" | "subscription";
  code?: string;
}

const Offers = () => {
  const navigate = useNavigate();
  
  useBackNavigation();

  const featuredOffers: Offer[] = [
    {
      id: "o1",
      title: "Summer Health Sale",
      description: "Get up to 25% off on summer health essentials",
      expires: "June 30, 2023",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "medicine",
      code: "SUMMER25"
    },
    {
      id: "o2",
      title: "Doctor Consultation Offer",
      description: "Flat ₹200 off on specialist consultations",
      expires: "May 20, 2023",
      discount: "₹200 OFF",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "doctor",
      code: "DOC200"
    }
  ];
  
  const additionalOffers: Offer[] = [
    {
      id: "o3",
      title: "First Order Discount",
      description: "20% off on your first medicine order",
      expires: "No expiry",
      discount: "20% OFF",
      image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "medicine",
      code: "FIRST20"
    },
    {
      id: "o4",
      title: "Zepmeds+ Membership",
      description: "Subscribe for premium benefits & free delivery",
      expires: "Ongoing",
      discount: "Premium",
      image: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "subscription"
    },
    {
      id: "o5",
      title: "Festive Season Offer",
      description: "Special discounts on health packages",
      expires: "July 15, 2023",
      discount: "30% OFF",
      image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "medicine",
      code: "FESTIVE30"
    }
  ];

  const handleViewAll = () => {
    navigate("/coupons");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Offers & Promotions" />

      <main className="px-4 py-4">
        <div className="glass-morphism rounded-xl p-4 mb-6">
          <div className="flex items-center mb-4">
            <Tag className="h-5 w-5 text-zepmeds-purple mr-2" />
            <h2 className="text-lg font-bold text-white">Featured Offers</h2>
          </div>
          
          <div className="space-y-4">
            {featuredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg"
              >
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-48 object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4">
                  <div className="absolute top-4 right-4 bg-zepmeds-purple text-white px-3 py-1 rounded-full text-sm font-bold">
                    {offer.discount}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{offer.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{offer.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Expires: {offer.expires}</span>
                      </div>
                      
                      {offer.code && (
                        <div className="bg-black/50 px-2 py-1 rounded text-xs text-white">
                          Code: <span className="font-semibold">{offer.code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Gift className="h-5 w-5 text-zepmeds-purple mr-2" />
            <h2 className="text-lg font-bold text-white">All Offers</h2>
          </div>
          
          <Button 
            variant="link" 
            className="text-zepmeds-purple p-0"
            onClick={handleViewAll}
          >
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          {additionalOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-morphism rounded-xl overflow-hidden flex"
            >
              <div className="w-24 h-auto">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold">{offer.title}</h3>
                  <span className="text-xs bg-zepmeds-purple/20 text-zepmeds-purple px-2 py-0.5 rounded-full">
                    {offer.discount}
                  </span>
                </div>
                
                <p className="text-gray-400 text-xs my-1">{offer.description}</p>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{offer.expires}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs px-2 text-zepmeds-purple hover:text-white hover:bg-zepmeds-purple/20"
                  >
                    Use now <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="glass-morphism rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Membership Benefits</h3>
            <Button size="sm" variant="link" className="text-zepmeds-purple p-0">
              Join now
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-3">
                <ShoppingBag className="h-4 w-4 text-zepmeds-purple" />
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Free Delivery</h4>
                <p className="text-gray-400 text-xs">On all orders, no minimum purchase</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-3">
                <Tag className="h-4 w-4 text-zepmeds-purple" />
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">5% Extra Discount</h4>
                <p className="text-gray-400 text-xs">On all medicine purchases</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-3">
                <Gift className="h-4 w-4 text-zepmeds-purple" />
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Priority Support</h4>
                <p className="text-gray-400 text-xs">Get assistance faster</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Offers;
