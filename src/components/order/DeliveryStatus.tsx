
import DeliveryAnimation from "@/components/DeliveryAnimation";

interface DeliveryStatusProps {
  currentStep: number;
  riderName: string;
  minutesRemaining: number;
  totalItems: number;
}

const DeliveryStatus = ({ currentStep, riderName, minutesRemaining, totalItems }: DeliveryStatusProps) => {
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Delivery Status</h3>
      <DeliveryAnimation
        currentStep={currentStep}
        riderName={riderName}
        eta={minutesRemaining}
        totalItems={totalItems}
      />
    </div>
  );
};

export default DeliveryStatus;
