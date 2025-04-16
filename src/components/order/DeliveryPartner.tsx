
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Phone, MessageSquare } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";

interface DeliveryPartnerProps {
  rider: any;
  orderId?: string;
  handleCallRider: () => void;
  handleMessageRider: () => void;
}

const DeliveryPartner = ({ rider, orderId, handleCallRider, handleMessageRider }: DeliveryPartnerProps) => {
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Your Delivery Partner</h3>
      
      <div className="flex items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 overflow-hidden border-2 border-orange-500">
            <img
              src={rider.profileImage || "https://source.unsplash.com/random/100x100/?face"} 
              alt={rider.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://source.unsplash.com/random/100x100/?face";
              }}
            />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
          >
            <Check className="h-3 w-3 text-white" />
          </motion.div>
        </div>
        
        <div className="ml-4 flex-1">
          <h4 className="text-white font-medium">{rider.name}</h4>
          <div className="flex items-center">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">
                  {i < Math.floor(rider.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="ml-1 text-white">{rider.rating}</span>
          </div>
          <p className="text-gray-400 text-sm">{rider.phone}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none"
            onClick={handleCallRider}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-none"
            onClick={handleMessageRider}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Separator className="my-4 bg-white/10" />
      
      <div className="h-40 rounded-lg overflow-hidden">
        <DeliveryMap showRider={true} orderId={orderId} />
      </div>
    </div>
  );
};

export default DeliveryPartner;
