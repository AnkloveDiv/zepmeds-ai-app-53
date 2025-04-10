
import { motion } from "framer-motion";

const DeliveryAnimation = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
            x: [-5, 5, -5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-4xl"
        >
          🛵
        </motion.div>
        
        <motion.div
          animate={{ width: [20, 100, 20] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="h-1 bg-zepmeds-purple"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs text-gray-400">ETA</div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-xl font-bold text-white"
        >
          15:00
        </motion.div>
        <div className="text-xs text-gray-400">minutes</div>
      </div>
    </div>
  );
};

export default DeliveryAnimation;
