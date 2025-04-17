
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderTracking } from "@/services/orders/trackOrder";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import OrderItems from "@/components/order/OrderItems";
import DeliveryStatus from "@/components/order/DeliveryStatus";
import DeliveryPartner from "@/components/order/DeliveryPartner";
import OrderHeader from "@/components/order/OrderHeader";
import OrderLoadingState from "@/components/order/OrderLoadingState";
import OrderErrorState from "@/components/order/OrderErrorState";
import OrderHelp from "@/components/order/OrderHelp";
import { FileText, ExternalLink } from "lucide-react";

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
          <DeliveryStatus 
            status={orderData.status} 
            estimatedDelivery={orderData.estimatedDelivery}
          />
          
          <DeliveryPartner 
            name={orderData.deliveryRider.name}
            rating={orderData.deliveryRider.rating}
            phone={orderData.deliveryRider.phone}
            eta={orderData.deliveryRider.eta}
            profileImage={orderData.deliveryRider.profileImage}
          />
          
          <OrderItems items={orderData.items || []} />
          
          {/* Display delivery address */}
          <div className="glass-morphism rounded-xl p-4">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <svg 
                className="w-5 h-5 mr-2 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              Delivery Address
            </h3>
            <p className="text-gray-400">{orderData.deliveryAddress}</p>
          </div>
          
          {/* Display prescription if available */}
          {orderData.prescription_url && (
            <div className="glass-morphism rounded-xl p-4 bg-amber-900/10">
              <h3 className="text-white font-medium mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-amber-400" />
                Prescription
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Prescription uploaded for this order</p>
                <a 
                  href={orderData.prescription_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-amber-400 hover:text-amber-300 text-sm"
                >
                  View <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          )}
          
          <OrderHelp orderId={orderData.id} />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TrackOrder;
