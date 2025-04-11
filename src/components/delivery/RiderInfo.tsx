
import { motion } from "framer-motion";
import { User, MapPin } from "lucide-react";

interface RiderInfoProps {
  riderName: string;
  timeLeft: number;
  distance: number;
}

const RiderInfo = ({ riderName, timeLeft, distance }: RiderInfoProps) => {
  return (
    <div className="flex items-center space-x-4 bg-black/20 rounded-xl p-3">
      <div className="w-12 h-12 rounded-full bg-orange-500/20 overflow-hidden border-2 border-orange-500 flex items-center justify-center text-white font-bold">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ZR
        </motion.div>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium flex items-center">
          <User className="h-4 w-4 text-orange-500 mr-1" />
          {riderName}
        </h3>
        <div className="flex items-center text-gray-400 text-sm">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mr-1"
          >
            <MapPin className="h-3 w-3 text-red-400" />
          </motion.div>
          <span>Arriving in {timeLeft} mins • {distance.toFixed(1)} km away</span>
        </div>
      </div>
    </div>
  );
};

export default RiderInfo;
