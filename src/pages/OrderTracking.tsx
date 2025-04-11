
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, Check, AlertCircle, MapPin } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Order {
  id: string;
  items: any[];
  status: string;
  placedAt: string;
  estimatedDelivery: string;
  deliveryRider: {
    name: string;
    rating: number;
    phone: string;
    eta: string;
  };
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ExitConfirmDialog } = useBackNavigation();
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setActiveOrder(parsedOrder);
      } catch (e) {
        console.error("Error parsing order data:", e);
      }
    }
    
    setLoading(false);
  }, []);
  
  const handleTrackOrder = () => {
    if (activeOrder) {
      navigate(`/track-order/${activeOrder.id}`);
    } else {
      toast({
        title: "No active order",
        description: "You don't have any active orders to track.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-zepmeds-purple border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Order Tracking" showBackButton />
      <ExitConfirmDialog />
      
      <main className="px-4 py-4">
        {activeOrder ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-morphism rounded-xl p-5 bg-gradient-to-br from-green-500/10 to-green-700/5">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Package className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Active Order</h2>
                  <p className="text-gray-400">Placed on {new Date(activeOrder.placedAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Order ID</span>
                  <span className="font-medium text-white">{activeOrder.id}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Status</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-sm">
                    {activeOrder.status}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-white">
                    {new Date(activeOrder.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Items</span>
                  <span className="font-medium text-white">{activeOrder.items.length}</span>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{activeOrder.deliveryRider.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="bg-amber-500/20 px-2 py-0.5 rounded-full text-xs text-amber-400 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {activeOrder.deliveryRider.rating} Rating
                    </div>
                    <p className="text-gray-400 text-xs ml-2">ETA: {activeOrder.deliveryRider.eta}</p>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={handleTrackOrder}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Track Live Location
              </Button>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              <p>Need help with your order?</p>
              <Button 
                variant="link" 
                className="text-zepmeds-purple p-0 h-auto text-sm"
                onClick={() => navigate("/support")}
              >
                Contact Support
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-amber-500/20 p-5 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Active Orders</h2>
            <p className="text-gray-400 text-center mb-6">You don't have any active orders to track at the moment.</p>
            <Button 
              className="bg-zepmeds-purple hover:bg-zepmeds-purple/90"
              onClick={() => navigate("/medicine-delivery")}
            >
              <Package className="mr-2 h-4 w-4" />
              Shop Medicines
            </Button>
          </motion.div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderTracking;
