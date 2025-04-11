
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TrackOrderButtonProps {
  orderId?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  label?: string;
  prominent?: boolean;
}

const TrackOrderButton = ({ 
  orderId, 
  className, 
  variant = "default", 
  size = "default",
  showIcon = true,
  label = "Track Order",
  prominent = false
}: TrackOrderButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleTrackOrder = () => {
    // If we have a specific order ID, navigate to that order
    if (orderId) {
      navigate(`/track-order/${orderId}`);
    } else {
      // Check for any ongoing orders
      const currentOrder = localStorage.getItem("currentOrder");
      if (currentOrder) {
        const orderData = JSON.parse(currentOrder);
        navigate(`/track-order/${orderData.id}`);
        toast({
          title: "Tracking your order",
          description: `Showing status for order #${orderData.id}`,
        });
      } else {
        // Otherwise just go to the tracking page
        navigate("/order-tracking");
      }
    }
  };
  
  // If it's prominent, we override some of the styling
  const buttonVariant = prominent ? "default" : variant;
  const buttonSize = prominent ? "lg" : size;
  const buttonClass = prominent 
    ? `bg-zepmeds-purple hover:bg-zepmeds-purple/90 text-white font-medium ${className || ""}`
    : className || "";
  
  return (
    <Button 
      variant={buttonVariant} 
      size={buttonSize}
      className={`flex items-center ${buttonClass}`}
      onClick={handleTrackOrder}
    >
      {showIcon && <Package className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
};

export default TrackOrderButton;
