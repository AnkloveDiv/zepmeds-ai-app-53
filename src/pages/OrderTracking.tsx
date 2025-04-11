
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { PackageCheck, ArrowRight } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useBackNavigation();
  
  useEffect(() => {
    // Extract order ID from URL if present
    const params = new URLSearchParams(location.search);
    const orderId = params.get('id');
    
    // If we have an order ID, redirect to the specific order tracking
    if (orderId) {
      navigate(`/track-order/${orderId}`);
    }
  }, [location.search, navigate]);

  const handleTrackByOrderId = () => {
    // Mock order ID for now
    navigate(`/track-order/ZM12345`);
  };

  const handleViewPastOrders = () => {
    navigate('/orders');
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Order Tracking" />
      
      <main className="px-4 py-6">
        <div className="h-40 glass-morphism rounded-xl mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mx-auto mb-3">
              <PackageCheck className="h-8 w-8 text-zepmeds-purple" />
            </div>
            <h3 className="text-white text-lg font-medium">Track Your Order</h3>
            <p className="text-gray-400 text-sm">View real-time delivery status</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full h-14 bg-zepmeds-purple hover:bg-zepmeds-purple/90"
            onClick={handleTrackByOrderId}
          >
            Track Current Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-14 border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10"
            onClick={handleViewPastOrders}
          >
            View Past Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-8 glass-morphism rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Order Tracking Tips</h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-zepmeds-purple mr-3 mt-0.5">
                <span className="text-sm">1</span>
              </div>
              <p className="text-gray-300 text-sm">You'll receive live updates on your order status</p>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-zepmeds-purple mr-3 mt-0.5">
                <span className="text-sm">2</span>
              </div>
              <p className="text-gray-300 text-sm">Contact your delivery partner directly from the tracking page</p>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-zepmeds-purple mr-3 mt-0.5">
                <span className="text-sm">3</span>
              </div>
              <p className="text-gray-300 text-sm">You can download your invoice once the order is confirmed</p>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderTracking;
