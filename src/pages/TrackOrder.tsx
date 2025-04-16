
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderTracking } from "@/services/orders/trackOrder";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import OrderItems from "@/components/order/OrderItems";
import DeliveryPartner from "@/components/order/DeliveryPartner";
import OrderHeader from "@/components/order/OrderHeader";
import OrderLoadingState from "@/components/order/OrderLoadingState";
import OrderErrorState from "@/components/order/OrderErrorState";
import OrderHelp from "@/components/order/OrderHelp";
import OrderStatusTimeline from "@/components/order/OrderStatusTimeline";

const TrackOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching order data for:", orderId);
        const data = await getOrderTracking(orderId);
        console.log("Order data received:", data);
        
        if (!data) {
          setError("Order not found");
        } else {
          setOrderData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        toast({
          title: "Error",
          description: "Could not load order details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderData();
  }, [orderId, toast]);
  
  if (loading) {
    return <OrderLoadingState />;
  }
  
  if (error || !orderData) {
    return <OrderErrorState error={error || "Order not found"} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 pb-20">
      <Header title={`Order: ${orderData.id}`} showBackButton />
      
      <div className="container mx-auto px-4 py-4">
        <OrderHeader 
          orderId={orderData.id} 
          status={orderData.status} 
          placedAt={orderData.placedAt}
          estimatedDelivery={orderData.estimatedDelivery}
        />
        
        <div className="mt-6 space-y-6">
          {/* Replace DeliveryStatus with our new OrderStatusTimeline component */}
          <OrderStatusTimeline orderId={orderData.id} />
          
          <DeliveryPartner 
            name={orderData.deliveryRider.name}
            rating={orderData.deliveryRider.rating}
            phone={orderData.deliveryRider.phone}
            eta={orderData.deliveryRider.eta}
            profileImage={orderData.deliveryRider.profileImage}
          />
          
          <OrderItems items={orderData.items || []} />
          
          <OrderHelp orderId={orderData.id} />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TrackOrder;
