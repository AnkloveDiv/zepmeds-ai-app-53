
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TrackOrderButtonProps extends ButtonProps {
  prominent?: boolean;
}

const TrackOrderButton = ({ prominent = false, className, ...props }: TrackOrderButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if there's an active order in localStorage
    const currentOrderJson = localStorage.getItem("currentOrder");
    if (currentOrderJson) {
      try {
        const currentOrder = JSON.parse(currentOrderJson);
        if (currentOrder && currentOrder.id) {
          setHasActiveOrder(true);
          setOrderId(currentOrder.id);
        }
      } catch (e) {
        console.error("Error parsing order data", e);
      }
    }
  }, []);
  
  const handleClick = () => {
    if (hasActiveOrder && orderId) {
      navigate(`/track-order/${orderId}`);
    } else {
      toast({
        title: "No active order",
        description: "You don't have any active orders to track.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button
      variant={prominent ? "default" : "outline"}
      size={prominent ? "default" : "sm"}
      className={cn(
        prominent ? 
          "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg" : 
          "border-green-500 text-green-500 hover:bg-green-500/10",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <Truck className={cn("mr-2", prominent ? "h-5 w-5" : "h-4 w-4")} />
      {hasActiveOrder ? "Track Your Order" : "No Active Orders"}
    </Button>
  );
};

export default TrackOrderButton;
