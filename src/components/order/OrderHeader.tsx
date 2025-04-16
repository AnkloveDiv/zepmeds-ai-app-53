
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Share2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import OrderActions from "@/components/order/OrderActions";
import { AnimatePresence } from "framer-motion";

interface OrderHeaderProps {
  orderId: string;
  status: string;
  placedAt: string;
  estimatedDelivery: string;
}

const OrderHeader = ({
  orderId,
  status,
  placedAt,
  estimatedDelivery,
}: OrderHeaderProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "Order ID Copied",
      description: `Order ID ${orderId} copied to clipboard`,
    });
  };
  
  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderId}`,
        text: `Check my medicine order #${orderId} from ZepMeds`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API",
      });
    }
  };
  
  const handleCallRider = () => {
    toast({
      title: "Calling rider",
      description: "Connecting you to the delivery partner...",
    });
    // In a real app, this would initiate a call
  };
  
  // Calculate minutes remaining (mock for now)
  const minutesRemaining = new Date(estimatedDelivery).getTime() > Date.now() 
    ? Math.round((new Date(estimatedDelivery).getTime() - Date.now()) / (1000 * 60))
    : 0;
  
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-white">Order #{orderId}</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyOrderId}
              className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Copy className="h-3 w-3 text-gray-400" />
            </motion.button>
          </div>
          
          <div className="flex items-center mt-1">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                color: ["#f97316", "#ffffff", "#f97316"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-xs font-medium"
            >
              {minutesRemaining > 0 ? `Arriving in ${minutesRemaining} min` : "Arriving soon"}
            </motion.div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-white/10"
            onClick={handleShareOrder}
          >
            <Share2 className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon" 
            className="h-8 w-8 rounded-full border-white/10 bg-green-500/10 text-green-500"
            onClick={handleCallRider}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs">Status</span>
            <span className="text-white text-sm truncate max-w-52">{status}</span>
          </div>
        </div>
        <Button
          variant="link"
          className="text-orange-500 p-0 h-auto text-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
          {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Separator className="my-3 bg-white/10" />
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Order placed</span>
                <span className="text-white">
                  {new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated arrival</span>
                <span className="text-white">
                  {new Date(estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <OrderActions orderId={orderId} compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHeader;
