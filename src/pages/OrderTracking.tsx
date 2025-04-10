
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Phone, Star, Clock, MapPin, DollarSign, ShoppingBag, AlertTriangle } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import { useToast } from "@/components/ui/use-toast";

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
    price: number;
  }>;
  expectedDeliveryTime?: Date;
  totalAmount?: number;
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 12, seconds: 0 });
  const [isLate, setIsLate] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    // Get order details
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      
      // Calculate total items
      const itemCount = parsedOrder.items.reduce((acc: number, item: any) => 
        acc + (item.quantity * item.stripQuantity), 0);
      setTotalItems(itemCount);
      
      // Calculate total amount if not already present
      if (!parsedOrder.totalAmount) {
        const total = parsedOrder.items.reduce((acc: number, item: any) => 
          acc + (item.price * item.quantity * item.stripQuantity), 0);
        parsedOrder.totalAmount = total;
      }
      
      setOrder(parsedOrder);
      
      // Check if order is late
      if (parsedOrder.expectedDeliveryTime) {
        const expectedTime = new Date(parsedOrder.expectedDeliveryTime);
        if (expectedTime < new Date()) {
          setIsLate(true);
          toast({
            title: "Delivery Update",
            description: "Your order is running late. We apologize for the inconvenience.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
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
  }, [navigate, toast]);
  
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4Z" fill="#9b87f5"/>
                <path d="M16 14H8C5.79 14 4 15.79 4 18V20H20V18C20 15.79 18.21 14 16 14Z" fill="#9b87f5"/>
                <path d="M12 2C7.58 2 4 5.58 4 10V11H7L9 7H15L17 11H20V10C20 5.58 16.42 2 12 2Z" fill="#9b87f5"/>
              </svg>
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
              
              {isLate && (
                <div className="mt-2 p-3 bg-red-500/20 rounded-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-300 text-sm">Your order is running late. We apologize for the delay.</span>
                </div>
              )}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Order Items</h3>
            <div className="flex items-center bg-zepmeds-purple/20 px-3 py-1 rounded-full">
              <ShoppingBag className="h-3 w-3 text-zepmeds-purple mr-1" />
              <span className="text-xs text-white">{totalItems} items</span>
            </div>
          </div>
          
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
                <div className="text-right">
                  <p className="text-white text-sm">₹{(item.price * item.quantity * item.stripQuantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            
            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm mt-1">
                <span>Delivery Fee</span>
                <span>₹49.00</span>
              </div>
              <div className="flex justify-between text-white font-medium mt-2">
                <span>Total</span>
                <span>₹{(order.totalAmount ? order.totalAmount + 49 : 49).toFixed(2)}</span>
              </div>
            </div>
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
