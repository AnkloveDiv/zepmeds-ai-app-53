
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import TrackOrderButton from "@/components/order/TrackOrderButton";

const DeliveryTracking = () => {
  const navigate = useNavigate();
  
  const handleOrderTracking = () => {
    navigate('/order-tracking');
  };
  
  return (
    <div className="my-4 p-3 rounded-xl glass-morphism bg-gradient-to-br from-zepmeds-purple/20 to-purple-600/10">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-3">
          <Package className="h-5 w-5 text-zepmeds-purple" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-sm font-medium">Need to track your order?</h3>
          <p className="text-gray-400 text-xs">Check delivery status in real-time</p>
        </div>
        
        <TrackOrderButton
          variant="outline"
          className="border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10 text-xs px-3 py-1 h-auto"
        />
      </div>
    </div>
  );
};

export default DeliveryTracking;
