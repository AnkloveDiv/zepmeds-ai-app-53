import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Phone, MapPin, Package, ChevronDown, ChevronUp, Copy, MessageSquare, Clock, Info, Share2, Check } from "lucide-react";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import DeliveryMap from "@/components/DeliveryMap";
import OrderActions from "@/components/order/OrderActions";
import useBackNavigation from "@/hooks/useBackNavigation";
import { motion, AnimatePresence } from "framer-motion";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { ExitConfirmDialog } = useBackNavigation();
  
  useEffect(() => {
    const getOrderDetails = () => {
      setLoading(true);
      
      try {
        if (orderId) {
          const savedOrder = localStorage.getItem("currentOrder");
          
          if (savedOrder) {
            const parsedOrder = JSON.parse(savedOrder);
            
            if (parsedOrder.id === orderId) {
              setOrder(parsedOrder);
              setLoading(false);
              return;
            }
          }
          
          const mockOrder = {
            id: orderId,
            status: "in-transit",
            estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            deliveryRider: {
              name: "Rahul Singh",
              rating: 4.8,
              phone: "+91 98765 43210",
              eta: "15 minutes",
              profileImage: "https://source.unsplash.com/random/100x100/?face"
            },
            items: [
              {
                id: "med-1",
                name: "Paracetamol",
                image: "https://source.unsplash.com/random/100x100/?medicine",
                quantity: 2,
                stripQuantity: 10,
                price: 25
              }
            ],
            totalAmount: 500,
            deliveryAddress: "123 Main St, Apartment 4B, New York, NY 10001",
            placedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
          };
          
          setOrder(mockOrder);
          localStorage.setItem("currentOrder", JSON.stringify(mockOrder));
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
    
    getOrderDetails();
  }, [orderId, toast]);
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId as string);
    toast({
      title: "Order ID Copied",
      description: `Order ID ${orderId} copied to clipboard`,
    });
  };
  
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
  
  const handleViewInvoice = () => {
    navigate(`/orders/invoice/${orderId}`);
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Package className="h-10 w-10 text-zepmeds-purple" />
            </motion.div>
          </div>
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton title="Track Order" />
        
        <main className="px-4 py-8 text-center">
          <div className="glass-morphism rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <Info className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Order Not Found</h3>
            <p className="text-gray-400 mb-6">We couldn't find the order you're looking for. It may have been cancelled or removed.</p>
            
            <Button
              className="bg-zepmeds-purple hover:bg-zepmeds-purple/90 w-full"
              onClick={() => navigate("/orders")}
            >
              View My Orders
            </Button>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    );
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
        <div className="mb-6 glass-morphism rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-white">Order #{order.id}</h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyOrderId}
                  className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <Copy className="h-3 w-3 text-gray-400" />
                </motion.button>
              </div>
              
              <div className="flex items-center mt-1">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    color: ["#f97316", "#ffffff", "#f97316"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-xs font-medium"
                >
                  {minutesRemaining > 0 ? `Arriving in ${minutesRemaining} min` : "Arriving soon"}
                </motion.div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-white/10"
                onClick={handleShareOrder}
              >
                <Share2 className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon" 
                className="h-8 w-8 rounded-full border-white/10 bg-green-500/10 text-green-500"
                onClick={handleCallRider}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs">Delivery address</span>
                <span className="text-white text-sm truncate max-w-52">{order.deliveryAddress || order.address?.address}</span>
              </div>
            </div>
            <Button
              variant="link"
              className="text-orange-500 p-0 h-auto text-sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View Details"}
              {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </div>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Separator className="my-3 bg-white/10" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order placed</span>
                    <span className="text-white">
                      {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated arrival</span>
                    <span className="text-white">
                      {estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total amount</span>
                    <span className="text-white">₹{order.totalAmount || 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment method</span>
                    <span className="text-white">{order.paymentMethod === "cod" ? "Cash on Delivery" : 
                         order.paymentMethod === "card" ? "Credit/Debit Card" : 
                         order.paymentMethod === "upi" ? "UPI" : 
                         order.paymentMethod === "bnpl" ? "Buy Now Pay Later" : "Online Payment"}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Number of items</span>
                    <span className="text-white">{order.items?.length || 0}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <OrderActions orderId={order.id} compact={true} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-6 glass-morphism rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-4">Delivery Status</h3>
          <DeliveryAnimation
            currentStep={currentStep}
            riderName={order.deliveryRider.name}
            eta={minutesRemaining}
            totalItems={order.items?.length || 0}
          />
        </div>
        
        <div className="mb-6 glass-morphism rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-4">Your Delivery Partner</h3>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 overflow-hidden border-2 border-orange-500">
                <img
                  src={order.deliveryRider.profileImage || "https://source.unsplash.com/random/100x100/?face"} 
                  alt={order.deliveryRider.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://source.unsplash.com/random/100x100/?face";
                  }}
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            </div>
            
            <div className="ml-4 flex-1">
              <h4 className="text-white font-medium">{order.deliveryRider.name}</h4>
              <div className="flex items-center">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < Math.floor(order.deliveryRider.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="ml-1 text-white">{order.deliveryRider.rating}</span>
              </div>
              <p className="text-gray-400 text-sm">{order.deliveryRider.phone}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none"
                onClick={handleCallRider}
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-none"
                onClick={handleMessageRider}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Separator className="my-4 bg-white/10" />
          
          <div className="h-40 rounded-lg overflow-hidden">
            <DeliveryMap showRider={true} orderId={orderId} />
          </div>
        </div>
        
        <div className="mb-6 glass-morphism rounded-xl p-4">
          <h3 className="text-white font-bold mb-2">Order Items</h3>
          
          <div className="space-y-3 mt-4">
            {order.items && order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                  <img
                    src={item.image || "https://source.unsplash.com/random/100x100/?medicine"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://source.unsplash.com/random/100x100/?medicine";
                    }}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-white">{item.name}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                    <span className="text-white">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6 glass-morphism rounded-xl p-4">
          <h3 className="text-white font-bold mb-4">Need Help?</h3>
          <OrderActions orderId={order.id} />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default TrackOrder;
