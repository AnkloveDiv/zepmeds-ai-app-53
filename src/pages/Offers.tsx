import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ShoppingBag, Tag, ChevronRight, Diamond, Heart, Gift, Pill, Users, Zap, Dog, Activity } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import Utensils from "@/components/icons/Utensils";

const Offers = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const [offers] = useState([
    {
      id: 1,
      title: "Heart Health Week",
      discount: "25% OFF",
      description: "On heart health medicines & supplements",
      validTill: "15 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?heart",
      category: "health",
      gradient: "linear-gradient(135deg, #FF6B6B, #FFD166)"
    },
    {
      id: 2,
      title: "Summer Hydration",
      discount: "FLAT ₹200 OFF",
      description: "On orders above ₹999",
      validTill: "30 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?water",
      category: "general",
      gradient: "linear-gradient(135deg, #4E65FF, #92EFFD)"
    },
    {
      id: 3,
      title: "Pet Care Special",
      discount: "30% OFF",
      description: "On all pet medications & supplements",
      validTill: "10 May 2025",
      image: "https://source.unsplash.com/random/400x200/?pets",
      category: "pet",
      gradient: "linear-gradient(135deg, #33D9B2, #00B5AA)"
    },
    {
      id: 4,
      title: "Lab Test Package",
      discount: "25% OFF",
      description: "On all comprehensive health packages",
      validTill: "12 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?laboratory",
      category: "test",
      gradient: "linear-gradient(135deg, #706FD3, #98D9EA)"
    },
    {
      id: 5,
      title: "First Time User",
      discount: "FLAT ₹300 OFF",
      description: "On minimum purchase of ₹1000",
      validTill: "Ongoing",
      image: "https://source.unsplash.com/random/400x200/?pharmacy-store",
      category: "new-user",
      gradient: "linear-gradient(135deg, #FF5E3A, #FF9E80)"
    },
    {
      id: 6,
      title: "Diabetes Care",
      discount: "15% OFF",
      description: "On all diabetes management products",
      validTill: "20 Apr 2025",
      image: "https://source.unsplash.com/random/400x200/?diabetes",
      category: "health",
      gradient: "linear-gradient(135deg, #6A5ACD, #A17FE0)"
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'supplement': return <Pill className="h-6 w-6 text-white" />;
      case 'consultation': return <Users className="h-6 w-6 text-white" />;
      case 'test': return <Zap className="h-6 w-6 text-white" />;
      case 'new-user': return <Gift className="h-6 w-6 text-white" />;
      case 'health': return <Heart className="h-6 w-6 text-white" />;
      case 'pet': return <Dog className="h-6 w-6 text-white" />;
      default: return <Diamond className="h-6 w-6 text-white" />;
    }
  };

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
              <div className="relative h-40" style={{ 
                background: offer.gradient,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute top-4 left-4 z-20 rounded-full p-2" style={{ background: `${offer.gradient}80` }}>
                  {getCategoryIcon(offer.category)}
                </div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <div className="bg-white text-black text-xl font-bold px-3 py-1 rounded-lg inline-block mb-2">
                    {offer.discount}
                  </div>
                  <h3 className="text-white text-xl font-bold">{offer.title}</h3>
                  <p className="text-gray-100">{offer.description}</p>
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
          <h2 className="text-xl font-bold text-white mb-5">Heart Health Week Special</h2>
          
          <div className="glass-morphism rounded-xl p-5 mb-6" style={{ 
            background: "linear-gradient(135deg, #FF6B6B30, #FFD16630)",
          }}>
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ background: "linear-gradient(135deg, #FF6B6B, #FFD166)" }}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Heart Health Essentials</h3>
                <p className="text-gray-300">Recommended by cardiologists</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg flex items-start">
                <Pill className="h-5 w-5 text-red-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Blood Pressure Medications</h4>
                  <p className="text-gray-400 text-xs">ACE inhibitors, beta-blockers, and more</p>
                </div>
              </div>
              
              <div className="p-3 bg-black/20 rounded-lg flex items-start">
                <Pill className="h-5 w-5 text-red-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Cholesterol Management</h4>
                  <p className="text-gray-400 text-xs">Statins and other cholesterol-lowering drugs</p>
                </div>
              </div>
              
              <div className="p-3 bg-black/20 rounded-lg flex items-start">
                <ShoppingBag className="h-5 w-5 text-orange-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Heart-Healthy Supplements</h4>
                  <p className="text-gray-400 text-xs">Omega-3, CoQ10, and other heart-supporting nutrients</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-white text-lg font-bold mt-6 mb-3">Recommended Activities</h3>
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg flex items-start">
                <Activity className="h-5 w-5 text-green-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Cardio Exercises</h4>
                  <p className="text-gray-400 text-xs">30 minutes of walking, swimming, or cycling daily</p>
                </div>
              </div>
              
              <div className="p-3 bg-black/20 rounded-lg flex items-start">
                <Utensils className="h-5 w-5 text-green-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Heart-Healthy Diet</h4>
                  <p className="text-gray-400 text-xs">Rich in fruits, vegetables, whole grains, and lean proteins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-5">Categories with Offers</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {['Medicine', 'Health Supplements', 'Personal Care', 'Medical Devices', 'Pet Care', 'Senior Care'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-xl p-4 flex flex-col items-center justify-center text-center"
                style={{ 
                  background: index % 2 === 0 
                    ? "linear-gradient(135deg, rgba(78, 101, 255, 0.2), rgba(146, 239, 253, 0.2))" 
                    : "linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 209, 102, 0.2))"
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ 
                  background: index % 2 === 0 
                    ? "linear-gradient(135deg, #4E65FF, #92EFFD)" 
                    : "linear-gradient(135deg, #FF6B6B, #FFD166)"
                }}>
                  <ShoppingBag className="h-6 w-6 text-white" />
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
          <div className="glass-morphism rounded-xl p-4 flex items-center justify-between" style={{ 
            background: "linear-gradient(135deg, rgba(106, 90, 205, 0.2), rgba(161, 127, 224, 0.2))"
          }}>
            <div>
              <h3 className="text-white font-medium mb-1">Have a coupon code?</h3>
              <p className="text-sm text-gray-400">Redeem it during checkout</p>
            </div>
            
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
              background: "linear-gradient(135deg, #6A5ACD, #A17FE0)"
            }}>
              <Tag className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Offers;
