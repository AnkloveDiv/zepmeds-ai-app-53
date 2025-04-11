
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ShoppingBag, Tag, ChevronRight, Diamond, Heart, Gift, Pill, Users, Zap, Dog, Activity } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import Utensils from "@/components/icons/Utensils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Offers = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers] = useState([
    {
      id: 1,
      title: "Heart Health Week",
      discount: "25% OFF",
      description: "On heart health medicines & supplements",
      validTill: "15 Apr 2025",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "health",
      gradient: "linear-gradient(135deg, #FF6B6B, #FFD166)"
    },
    {
      id: 2,
      title: "Summer Hydration",
      discount: "FLAT ₹200 OFF",
      description: "On orders above ₹999",
      validTill: "30 Apr 2025",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80",
      category: "general",
      gradient: "linear-gradient(135deg, #4E65FF, #92EFFD)"
    },
    {
      id: 3,
      title: "Pet Care Special",
      discount: "30% OFF",
      description: "On all pet medications & supplements",
      validTill: "10 May 2025",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2360&q=80",
      category: "pet",
      gradient: "linear-gradient(135deg, #33D9B2, #00B5AA)"
    },
    {
      id: 4,
      title: "Lab Test Package",
      discount: "25% OFF",
      description: "On all comprehensive health packages",
      validTill: "12 Apr 2025",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "test",
      gradient: "linear-gradient(135deg, #706FD3, #98D9EA)"
    },
    {
      id: 5,
      title: "First Time User",
      discount: "FLAT ₹300 OFF",
      description: "On minimum purchase of ₹1000",
      validTill: "Ongoing",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      category: "new-user",
      gradient: "linear-gradient(135deg, #FF5E3A, #FF9E80)"
    },
    {
      id: 6,
      title: "Diabetes Care",
      discount: "15% OFF",
      description: "On all diabetes management products",
      validTill: "20 Apr 2025",
      image: "https://images.unsplash.com/photo-1544829894-b1681a007b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
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

  const handleShopNow = (offer: any) => {
    toast({
      title: "Offer Applied",
      description: `${offer.discount} discount has been applied to your next purchase.`,
      duration: 3000,
    });
    
    // Navigate based on the category
    if (offer.category === 'pet') {
      navigate('/pet-care');
    } else if (offer.category === 'health') {
      navigate('/medicine-delivery?category=supplements');
    } else {
      navigate('/medicine-delivery');
    }
  };

  const handleViewOffers = (category: string) => {
    toast({
      title: `${category} Offers`,
      description: `Browsing special offers for ${category}.`,
      duration: 3000,
    });
    navigate(`/medicine-delivery?category=${category.toLowerCase().replace(/\s+/g, '')}`);
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
              <div 
                className="relative h-40 bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url(${offer.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="absolute top-4 left-4 z-20 rounded-full p-2" style={{ background: `${offer.gradient}90` }}>
                  {getCategoryIcon(offer.category)}
                </div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <div className="bg-white text-black text-xl font-bold px-3 py-1 rounded-lg inline-block mb-2">
                    {offer.discount}
                  </div>
                  <h3 className="text-white text-xl font-bold shadow-text">{offer.title}</h3>
                  <p className="text-gray-100 shadow-text">{offer.description}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Valid till {offer.validTill}</span>
                </div>
                
                <motion.button 
                  className="flex items-center text-zepmeds-purple"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShopNow(offer)}
                >
                  <span>Shop Now</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-5">Heart Health Week Special</h2>
          
          <div 
            className="glass-morphism rounded-xl p-5 mb-6 bg-cover bg-center" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 107, 107, 0.3), rgba(255, 209, 102, 0.3)), url("https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80")',
            }}
          >
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
              <motion.div 
                className="p-3 bg-black/40 rounded-lg flex items-start backdrop-blur-sm"
                whileHover={{ x: 5 }}
              >
                <Pill className="h-5 w-5 text-red-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Blood Pressure Medications</h4>
                  <p className="text-gray-300 text-xs">ACE inhibitors, beta-blockers, and more</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-3 bg-black/40 rounded-lg flex items-start backdrop-blur-sm"
                whileHover={{ x: 5 }}
              >
                <Pill className="h-5 w-5 text-red-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Cholesterol Management</h4>
                  <p className="text-gray-300 text-xs">Statins and other cholesterol-lowering drugs</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-3 bg-black/40 rounded-lg flex items-start backdrop-blur-sm"
                whileHover={{ x: 5 }}
              >
                <ShoppingBag className="h-5 w-5 text-orange-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Heart-Healthy Supplements</h4>
                  <p className="text-gray-300 text-xs">Omega-3, CoQ10, and other heart-supporting nutrients</p>
                </div>
              </motion.div>
            </div>
            
            <h3 className="text-white text-lg font-bold mt-6 mb-3">Recommended Activities</h3>
            <div className="space-y-3">
              <motion.div 
                className="p-3 bg-black/40 rounded-lg flex items-start backdrop-blur-sm"
                whileHover={{ x: 5 }}
              >
                <Activity className="h-5 w-5 text-green-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Cardio Exercises</h4>
                  <p className="text-gray-300 text-xs">30 minutes of walking, swimming, or cycling daily</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-3 bg-black/40 rounded-lg flex items-start backdrop-blur-sm"
                whileHover={{ x: 5 }}
              >
                <Utensils className="h-5 w-5 text-green-400 mr-2 mt-1" />
                <div>
                  <h4 className="text-white text-sm font-medium">Heart-Healthy Diet</h4>
                  <p className="text-gray-300 text-xs">Fish, nuts, berries, leafy greens, whole grains, olive oil</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-5">Categories with Offers</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {name: 'Medicine', icon: <Pill className="h-6 w-6 text-white" />, discount: 'Up to 30% off', gradient: 'linear-gradient(135deg, #4E65FF, #92EFFD)'},
              {name: 'Health Supplements', icon: <Gift className="h-6 w-6 text-white" />, discount: 'Up to 25% off', gradient: 'linear-gradient(135deg, #FF6B6B, #FFD166)'},
              {name: 'Personal Care', icon: <ShoppingBag className="h-6 w-6 text-white" />, discount: 'Up to 15% off', gradient: 'linear-gradient(135deg, #33D9B2, #00B5AA)'},
              {name: 'Medical Devices', icon: <Zap className="h-6 w-6 text-white" />, discount: 'Up to 20% off', gradient: 'linear-gradient(135deg, #6A5ACD, #A17FE0)'},
              {name: 'Pet Care', icon: <Dog className="h-6 w-6 text-white" />, discount: 'Up to 30% off', gradient: 'linear-gradient(135deg, #FF5E3A, #FF9E80)'},
              {name: 'Senior Care', icon: <Heart className="h-6 w-6 text-white" />, discount: 'Up to 20% off', gradient: 'linear-gradient(135deg, #4E65FF, #92EFFD)'}
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer"
                style={{ 
                  background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), ${category.gradient}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewOffers(category.name)}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ 
                  background: category.gradient
                }}>
                  {category.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{category.name}</h3>
                <p className="text-xs text-gray-200">{category.discount}</p>
                <button className="mt-3 text-xs text-white flex items-center">
                  <span>View Offers</span>
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <motion.div 
            className="glass-morphism rounded-xl p-4 flex items-center justify-between" 
            style={{ background: "linear-gradient(135deg, rgba(106, 90, 205, 0.4), rgba(161, 127, 224, 0.4))" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast({
              title: "Coupon Code",
              description: "Use code ZEPMEDS for 20% off your next order!",
              duration: 5000,
            })}
          >
            <div>
              <h3 className="text-white font-medium mb-1">Have a coupon code?</h3>
              <p className="text-sm text-gray-300">Redeem it during checkout</p>
            </div>
            
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
              background: "linear-gradient(135deg, #6A5ACD, #A17FE0)"
            }}>
              <Tag className="h-5 w-5 text-white" />
            </div>
          </motion.div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Offers;
