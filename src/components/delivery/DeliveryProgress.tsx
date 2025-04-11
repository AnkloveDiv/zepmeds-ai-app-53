
import { Progress } from "@/components/ui/progress";

interface DeliveryProgressProps {
  progress: number;
  progressColor: string;
}

const DeliveryProgress = ({ progress, progressColor }: DeliveryProgressProps) => {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Order Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName={progressColor} />
    </div>
  );
};

export default DeliveryProgress;
