
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface DeliveryTimerProps {
  timeLeft: number;
  distance: number;
}

const DeliveryTimer = ({ timeLeft, distance }: DeliveryTimerProps) => {
  return (
    <div className="flex items-center justify-center space-x-6">
      <div className="flex flex-col items-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-1"
        >
          <Clock className="h-6 w-6 text-orange-500" />
        </motion.div>
        <span className="text-white font-medium">{timeLeft} min</span>
        <span className="text-xs text-gray-400">Arrival time</span>
      </div>
      
      <div className="flex flex-col items-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-1"
        >
          <MapPin className="h-6 w-6 text-red-500" />
        </motion.div>
        <span className="text-white font-medium">{distance.toFixed(1)} km</span>
        <span className="text-xs text-gray-400">Distance</span>
      </div>
    </div>
  );
};

export default DeliveryTimer;
