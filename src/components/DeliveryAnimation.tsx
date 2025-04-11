
import { motion } from "framer-motion";
import { Clock, MapPin, Milestone, User, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface DeliveryAnimationProps {
  steps?: string[];
  currentStep?: number;
  riderName?: string;
  eta?: number;
  initialDistance?: number;
}

const DeliveryAnimation = ({
  steps = ["Order Confirmed", "Preparing", "Rider Pickup", "On the Way", "Delivered"],
  currentStep = 2,
  riderName = "Rahul Singh",
  eta = 15,
  initialDistance = 2.4
}: DeliveryAnimationProps) => {
  const [progress, setProgress] = useState((currentStep / (steps.length - 1)) * 100);
  const [distance, setDistance] = useState(initialDistance);
  const [timeLeft, setTimeLeft] = useState(eta);

  // Simulate rider moving and time decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      if (distance > 0.1) {
        setDistance(prev => Math.max(prev - 0.1, 0));
      }
      
      if (timeLeft > 1) {
        setTimeLeft(prev => prev - 1);
      } else if (currentStep < steps.length - 1) {
        // If we reach the customer, mark as delivered (in a real app this would come from backend)
        setProgress(100);
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [distance, timeLeft, currentStep, steps.length]);

  return (
    <div className="space-y-6">
      {/* Rider info */}
      <div className="flex items-center space-x-4 bg-black/20 rounded-xl p-3">
        <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 overflow-hidden border-2 border-zepmeds-purple flex items-center justify-center text-white font-bold">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ZR
          </motion.div>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium flex items-center">
            <User className="h-4 w-4 text-zepmeds-purple mr-1" />
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

      {/* Delivery Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Order Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-800" />
      </div>

      {/* Milestone tracking */}
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-gray-700 z-0"></div>
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={index} className="flex mb-4 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 ${
                isCompleted ? "bg-zepmeds-purple" : "bg-gray-700"
              }`}>
                {isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                ) : (
                  <Milestone className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-medium ${isCompleted ? "text-white" : "text-gray-400"}`}>
                  {step}
                </h3>
                {isActive && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-zepmeds-purple"
                  >
                    In progress...
                  </motion.p>
                )}
              </div>
              
              {isCompleted && index < currentStep && (
                <div className="text-green-400 text-xs flex items-center">
                  <span>Completed</span>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Animated rider icon */}
        <motion.div
          className="absolute left-2 z-20"
          initial={{ top: `${(currentStep / (steps.length - 1)) * 100}%` }}
          animate={{ 
            top: [`${(currentStep / (steps.length - 1)) * 100}%`, `${((currentStep+0.5) / (steps.length - 1)) * 100}%`, `${(currentStep / (steps.length - 1)) * 100}%`],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginTop: -14 }}
        >
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <Package className="h-3 w-3 text-white" />
          </div>
        </motion.div>
      </div>
      
      {/* Delivery timer */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mb-1"
          >
            <Clock className="h-6 w-6 text-zepmeds-purple" />
          </motion.div>
          <span className="text-white font-medium">{timeLeft} min</span>
          <span className="text-xs text-gray-400">Arrival time</span>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mb-1"
          >
            <MapPin className="h-6 w-6 text-zepmeds-purple" />
          </motion.div>
          <span className="text-white font-medium">{distance.toFixed(1)} km</span>
          <span className="text-xs text-gray-400">Distance</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnimation;
