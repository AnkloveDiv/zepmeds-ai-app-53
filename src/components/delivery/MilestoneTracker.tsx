
import { motion } from "framer-motion";
import { Milestone, Package } from "lucide-react";

interface MilestoneTrackerProps {
  steps: string[];
  currentStep: number;
}

const MilestoneTracker = ({ steps, currentStep }: MilestoneTrackerProps) => {
  // Color scheme
  const activeIconBg = "bg-orange-500";
  const completedIconBg = "bg-green-500";
  const pendingIconBg = "bg-gray-700";
  const activeTextColor = "text-orange-500";
  const completedTextColor = "text-green-500";
  const pendingTextColor = "text-gray-400";

  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-gray-700 z-0"></div>
      
      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;
        const isActive = index === currentStep;
        const iconBg = isActive ? activeIconBg : isCompleted ? completedIconBg : pendingIconBg;
        const textColor = isActive ? activeTextColor : isCompleted ? completedTextColor : pendingTextColor;
        
        return (
          <div key={index} className="flex mb-4 relative z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 ${iconBg}`}>
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
                  className={`text-xs ${textColor}`}
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
        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
          <Package className="h-3 w-3 text-white" />
        </div>
      </motion.div>
    </div>
  );
};

export default MilestoneTracker;
