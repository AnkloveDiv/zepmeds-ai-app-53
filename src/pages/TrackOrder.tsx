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
import { supabase } from "@/integrations/supabase/client";

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
          const { data: orderFromSupabase, error: orderError } = await supabase
            .from('orders_new')
            .select('*')
            .eq('order_id', orderId)
            .maybeSingle();
            
          if (orderError) {
            console.error("Error fetching from orders_new:", orderError);
            setError("Order not found");
          } else if (orderFromSupabase) {
            console.log("Order found in orders_new table:", orderFromSupabase);
            const adaptedOrder = {
              id: orderFromSupabase.order_id,
              status: orderFromSupabase.action || "confirmed",
              placedAt: orderFromSupabase.date,
              estimatedDelivery: new Date(new Date(orderFromSupabase.date).getTime() + 60 * 60 * 1000).toISOString(),
              items: orderFromSupabase.items ? JSON.parse(orderFromSupabase.items) : [],
              deliveryRider: {
                name: "Rahul Singh",
                rating: 4.8,
                phone: "+91 98765 43210",
                eta: "30 minutes",
                profileImage: "https://source.unsplash.com/random/100x100/?face"
              }
            };
            setOrderData(adaptedOrder);
            setError(null);
          } else {
            setError("Order not found");
          }
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
