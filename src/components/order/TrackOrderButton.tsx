import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface TrackOrderButtonProps {
  orderId?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const TrackOrderButton = ({ orderId, className, variant = "default" }: TrackOrderButtonProps) => {
  const navigate = useNavigate();
  
  const handleTrackOrder = () => {
    // If we have a specific order ID, navigate to that order
    if (orderId) {
      navigate(`/track-order/${orderId}`);
    } else {
      // Otherwise just go to the tracking page
      navigate("/order-tracking");
    }
  };
  
  return (
    <Button 
      variant={variant} 
      className={`flex items-center ${className || ""}`}
      onClick={handleTrackOrder}
    >
      <Package className="mr-2 h-4 w-4" />
      Track Order
    </Button>
  );
};

export default TrackOrderButton;
