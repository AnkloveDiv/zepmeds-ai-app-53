
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Share2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import OrderActions from "@/components/order/OrderActions";
import { AnimatePresence } from "framer-motion";

interface OrderHeaderProps {
  order: any;
  orderId: string;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  minutesRemaining: number;
  handleShareOrder: () => void;
  handleCallRider: () => void;
}

const OrderHeader = ({
  order,
  orderId,
  showDetails,
  setShowDetails,
  minutesRemaining,
  handleShareOrder,
  handleCallRider
}: OrderHeaderProps) => {
  const { toast } = useToast();
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "Order ID Copied",
      description: `Order ID ${orderId} copied to clipboard`,
    });
  };
  
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-white">Order #{order.id}</h2>
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
            <span className="text-gray-400 text-xs">Delivery address</span>
            <span className="text-white text-sm truncate max-w-52">{order.deliveryAddress || order.address?.address}</span>
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
                  {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated arrival</span>
                <span className="text-white">
                  {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total amount</span>
                <span className="text-white">₹{order.totalAmount || 0}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment method</span>
                <span className="text-white">{order.paymentMethod === "cod" ? "Cash on Delivery" : 
                     order.paymentMethod === "card" ? "Credit/Debit Card" : 
                     order.paymentMethod === "upi" ? "UPI" : 
                     order.paymentMethod === "bnpl" ? "Buy Now Pay Later" : "Online Payment"}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Number of items</span>
                <span className="text-white">{order.items?.length || 0}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <OrderActions orderId={order.id} compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHeader;
