
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const DeliveryAnimation = () => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center">
        <div className="relative">
          {/* Delivery rider with helmet - simple icon */}
          <motion.div 
            animate={{ 
              x: [0, 40, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-3xl relative z-10 bg-zepmeds-purple p-2 rounded-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4Z" fill="white"/>
              <path d="M16 14H8C5.79 14 4 15.79 4 18V20H20V18C20 15.79 18.21 14 16 14Z" fill="white"/>
              <path d="M12 2C7.58 2 4 5.58 4 10V11H7L9 7H15L17 11H20V10C20 5.58 16.42 2 12 2Z" fill="white"/>
            </svg>
          </motion.div>
          
          {/* Progress path to destination */}
          <motion.div
            initial={{ width: 5 }}
            animate={{ width: [5, 100, 5] }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="h-1 bg-zepmeds-purple absolute top-1/2 -translate-y-1/2 left-full"
          />
          
          {/* Destination marker */}
          <motion.div
            className="absolute left-[120px] top-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <MapPin className="h-5 w-5 text-zepmeds-purple" />
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white">
          <Clock className="h-4 w-4 text-zepmeds-purple" />
          <span className="text-sm text-gray-400">Estimated Time:</span>
          <motion.div
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-lg font-bold text-white"
          >
            12 min
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2 text-white">
          <MapPin className="h-4 w-4 text-zepmeds-purple" />
          <span className="text-sm text-gray-400">Distance:</span>
          <motion.div
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-lg font-bold text-white"
          >
            2.4 km
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnimation;
