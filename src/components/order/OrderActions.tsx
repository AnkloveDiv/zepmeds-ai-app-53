
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Phone, MessageCircle, Ban, HelpCircle } from "lucide-react";
import { updateOrderStatus } from "@/services/orderService";

interface OrderActionsProps {
  orderId: string;
  compact?: boolean;
}

const OrderActions = ({ orderId, compact = false }: OrderActionsProps) => {
  const { toast } = useToast();
  
  const handleCancelOrder = async () => {
    try {
      await updateOrderStatus(orderId, "cancelled");
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      });
      
      // Force reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSupportRequest = () => {
    toast({
      title: "Support request sent",
      description: "Our customer service will contact you shortly.",
    });
  };
  
  return (
    <div className={`flex ${compact ? "flex-col gap-2" : "flex-row gap-3 justify-between"} mt-4`}>
      <Button 
        variant="outline" 
        size={compact ? "sm" : "default"}
        className={`${compact ? "w-full" : "flex-1"} bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/30`}
        onClick={handleCancelOrder}
      >
        <Ban className={`${compact ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}`} />
        Cancel Order
      </Button>
      <Button 
        variant="outline" 
        size={compact ? "sm" : "default"}
        className={`${compact ? "w-full" : "flex-1"} bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/30`}
        onClick={handleSupportRequest}
      >
        <HelpCircle className={`${compact ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}`} />
        Need Help?
      </Button>
    </div>
  );
};

export default OrderActions;
