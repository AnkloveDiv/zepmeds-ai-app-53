
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Phone, Star, Clock, MapPin } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";
import DeliveryAnimation from "@/components/DeliveryAnimation";

interface OrderDetails {
  id: string;
  deliveryRider: {
    name: string;
    rating: number;
    phone: string;
    eta: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    stripQuantity: number;
  }>;
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  
  useEffect(() => {
    // Get order details
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      navigate("/dashboard");
    }
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-zepmeds-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-6">
      <Header showBackButton title={`Order #${order.id}`} />
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-zepmeds-purple mr-3">
              <span className="text-xl">🚴</span>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-white font-medium">{order.deliveryRider.name}</h3>
                  <div className="flex items-center text-sm">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <Star className="h-3 w-3 fill-yellow-400 mr-1" />
                      <span>{order.deliveryRider.rating}</span>
                    </div>
                    <span className="text-gray-400">Delivery Partner</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10"
                >
                  <Phone size={16} className="mr-1" /> Call
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-zepmeds-purple mr-2" />
                  <span className="text-gray-300">Estimated Delivery Time:</span>
                  <span className="ml-auto text-white font-bold">
                    {timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="glass-morphism rounded-xl overflow-hidden mb-6">
          <div className="h-48 relative">
            <DeliveryMap />
            <div className="absolute bottom-4 left-4 glass-morphism rounded-lg p-2 flex items-center">
              <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
              <span className="text-sm text-white">Delivering to your location</span>
            </div>
          </div>
          
          <div className="p-4 flex justify-center">
            <DeliveryAnimation />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-medium mb-4">Order Items</h3>
          
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center bg-black/20 rounded-lg p-2">
                <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">
                    {item.quantity} x {item.stripQuantity} strips
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="glass-morphism rounded-xl p-4 overflow-hidden">
          <h3 className="text-white font-medium mb-2">Special Offers</h3>
          <p className="text-gray-400 text-sm mb-3">Exclusive deals for you</p>
          
          <div className="h-24 rounded-lg bg-gradient-to-r from-zepmeds-purple to-purple-600 flex items-center p-4 text-white">
            <div>
              <p className="font-bold">20% OFF</p>
              <p className="text-sm">on your next order</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
