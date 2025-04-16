
import DeliveryAnimation from "@/components/delivery/DeliveryAnimation";

interface DeliveryStatusProps {
  status: string;
  estimatedDelivery: string;
}

const DeliveryStatus = ({ status, estimatedDelivery }: DeliveryStatusProps) => {
  // Map the status to a step number for the delivery animation
  let currentStep = 1;
  switch (status) {
    case "processing":
      currentStep = 1;
      break;
    case "packed":
      currentStep = 2;
      break;
    case "in-transit":
      currentStep = 3;
      break;
    case "delivered":
      currentStep = 4;
      break;
    default:
      currentStep = 1;
  }
  
  // Calculate minutes remaining until estimated delivery
  const minutesRemaining = Math.max(
    0,
    Math.round((new Date(estimatedDelivery).getTime() - Date.now()) / (1000 * 60))
  );
  
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Delivery Status</h3>
      <DeliveryAnimation
        currentStep={currentStep}
        riderName="Delivery Partner"
        eta={minutesRemaining}
        totalItems={1}
      />
    </div>
  );
};

export default DeliveryStatus;
