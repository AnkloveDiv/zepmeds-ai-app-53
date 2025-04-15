import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";
import { getOrderTracking } from "@/services/orderService";

// Refactored components
import OrderLoadingState from "@/components/order/OrderLoadingState";
import OrderErrorState from "@/components/order/OrderErrorState";
import OrderHeader from "@/components/order/OrderHeader";
import DeliveryStatus from "@/components/order/DeliveryStatus";
import DeliveryPartner from "@/components/order/DeliveryPartner";
import OrderItems from "@/components/order/OrderItems";
import OrderHelp from "@/components/order/OrderHelp";
import ChatbotModal from "@/components/chat/ChatbotModal";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { ExitConfirmDialog } = useBackNavigation();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      try {
        if (orderId) {
          const orderData = await getOrderTracking(orderId);
          setOrder(orderData);
        } else {
          throw new Error("Order ID is missing");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(true);
        toast({
          title: "Error loading order",
          description: "Could not load the order details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, toast]);
  
  const handleCallRider = () => {
    if (order?.deliveryRider?.phone) {
      window.location.href = `tel:${order.deliveryRider.phone}`;
    } else {
      toast({
        title: "Cannot call rider",
        description: "Rider phone number is not available",
        variant: "destructive"
      });
    }
  };
  
  const handleMessageRider = () => {
    toast({
      title: "Message sent to rider",
      description: "Your message has been sent to the rider",
    });
  };
  
  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderId} from ZepMeds`,
        text: `Track my medicine delivery from ZepMeds. Order #${orderId}`,
        url: window.location.href
      }).catch(err => {
        console.error("Share failed:", err);
      });
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser does not support the Web Share API",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };
  
  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };
  
  if (loading) {
    return <OrderLoadingState />;
  }
  
  if (error || !order) {
    return <OrderErrorState />;
  }
  
  const estimatedDelivery = new Date(order.estimatedDelivery);
  const now = new Date();
  const minutesRemaining = Math.floor((estimatedDelivery.getTime() - now.getTime()) / (1000 * 60));
  
  const orderStatus = order.status || "confirmed";
  const statusMap = {
    "confirmed": { step: 0, text: "Order Confirmed" },
    "preparing": { step: 1, text: "Preparing" },
    "rider-assigned": { step: 2, text: "Rider Assigned" },
    "in-transit": { step: 3, text: "On the Way" },
    "delivered": { step: 4, text: "Delivered" }
  };
  const currentStep = statusMap[orderStatus]?.step || 0;
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Track Order" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-4">
        <OrderHeader 
          order={order}
          orderId={orderId || ''}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          minutesRemaining={minutesRemaining}
          handleShareOrder={handleShareOrder}
          handleCallRider={handleCallRider}
        />

        <DeliveryStatus 
          currentStep={currentStep}
          riderName={order.deliveryRider.name}
          minutesRemaining={minutesRemaining}
          totalItems={order.items?.length || 0}
        />
        
        <DeliveryPartner 
          rider={order.deliveryRider}
          orderId={orderId}
          handleCallRider={handleCallRider}
          handleMessageRider={handleMessageRider}
        />
        
        <OrderItems items={order.items || []} />
        
        <OrderHelp orderId={order.id} />
      </main>
      
      <BottomNavigation />
      
      {/* Chatbot Modal */}
      <ChatbotModal 
        isOpen={showChatbot} 
        onClose={handleCloseChatbot} 
        orderId={orderId || ''} 
      />
    </div>
  );
};

export default TrackOrder;
