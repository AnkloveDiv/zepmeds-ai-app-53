
import { useState, useEffect } from "react";
import RiderInfo from "./RiderInfo";
import OrderInfo from "./OrderInfo";
import DeliveryProgress from "./DeliveryProgress";
import MilestoneTracker from "./MilestoneTracker";
import DeliveryTimer from "./DeliveryTimer";

interface DeliveryAnimationProps {
  steps?: string[];
  currentStep?: number;
  riderName?: string;
  eta?: number;
  initialDistance?: number;
  totalItems?: number;
}

const DeliveryAnimation = ({
  steps = ["Order Confirmed", "Preparing", "Rider Pickup", "On the Way", "Delivered"],
  currentStep = 2,
  riderName = "Rahul Singh",
  eta = 15,
  initialDistance = 2.4,
  totalItems = 3
}: DeliveryAnimationProps) => {
  const [progress, setProgress] = useState((currentStep / (steps.length - 1)) * 100);
  const [distance, setDistance] = useState(initialDistance);
  const [timeLeft, setTimeLeft] = useState(eta);

  // Color scheme update
  const progressColor = "bg-orange-500";

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
      <RiderInfo 
        riderName={riderName}
        timeLeft={timeLeft}
        distance={distance}
      />
      
      {/* Order info */}
      <OrderInfo totalItems={totalItems} />

      {/* Delivery Progress */}
      <DeliveryProgress 
        progress={progress}
        progressColor={progressColor}
      />

      {/* Milestone tracking */}
      <MilestoneTracker 
        steps={steps}
        currentStep={currentStep}
      />
      
      {/* Delivery timer */}
      <DeliveryTimer 
        timeLeft={timeLeft}
        distance={distance}
      />
    </div>
  );
};

export default DeliveryAnimation;
