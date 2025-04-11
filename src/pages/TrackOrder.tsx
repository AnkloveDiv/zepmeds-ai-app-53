
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import DeliveryMap from "@/components/DeliveryMap";
import { Button } from "@/components/ui/button";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import { Phone, Clock, MapPin, AlertTriangle, Package, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [isLate, setIsLate] = useState(false);
  const [showMap, setShowMap] = useState(true);
  
  useBackNavigation();
  
  useEffect(() => {
    // In a real app, you'd fetch order data from an API
    // For now, we'll use mock data from localStorage
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else if (orderId) {
      // Mock fetching by ID
      const mockOrder = {
        id: orderId,
        status: "in-transit",
        estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        deliveryRider: {
          name: "Rahul Singh",
          rating: 4.8,
          phone: "+91 98765 43210",
          eta: "15 minutes"
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
        totalAmount: 500
      };
      setOrder(mockOrder);
    } else {
      toast({
        title: "Order not found",
        description: "Please try again with a valid order ID",
        variant: "destructive"
      });
      navigate("/orders");
    }
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [orderId, navigate, toast]);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-zepmeds-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const handleCallRider = () => {
    toast({
      title: "Calling rider",
      description: `Connecting you to ${order.deliveryRider.name}...`,
    });
  };
  
  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: "Invoice has been downloaded to your device",
    });
  };
  
  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: "Our customer support team will contact you shortly",
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title={`Track Order #${order.id}`} />
      
      <main className="px-4 py-4">
        <div className="glass-morphism rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-zepmeds-purple/20 flex items-center justify-center text-zepmeds-purple mr-3">
              <Package className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-white font-medium">{order.deliveryRider.name}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-yellow-400 mr-2">{order.deliveryRider.rating}</span>
                    <span className="text-gray-400">Delivery Partner</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-zepmeds-purple text-zepmeds-purple hover:bg-zepmeds-purple/10"
                  onClick={handleCallRider}
                >
                  <Phone size={16} className="mr-1" /> Call
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-zepmeds-purple mr-2" />
                  <span className="text-gray-300">Estimated Delivery Time:</span>
                  <span className="ml-auto text-white font-bold">
                    {timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              {isLate && (
                <div className="mt-2 p-3 bg-red-500/20 rounded-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-300 text-sm">Your order is running late. We apologize for the delay.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl overflow-hidden mb-6">
          <div className="h-48 relative">
            {showMap ? (
              <DeliveryMap showRider={true} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <DeliveryAnimation />
              </div>
            )}
            <div className="absolute bottom-4 left-4 glass-morphism rounded-lg p-2 flex items-center">
              <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
              <span className="text-sm text-white">Delivering to your location</span>
            </div>
          </div>
          
          <div className="p-4 flex justify-between items-center">
            <DeliveryAnimation />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-zepmeds-purple"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Hide map" : "Show map"}
            </Button>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Order Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-white text-sm">Order Confirmed</p>
                <p className="text-gray-400 text-xs">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-white text-sm">Order Packed</p>
                <p className="text-gray-400 text-xs">Today, 10:45 AM</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zepmeds-purple flex items-center justify-center mr-3 animate-pulse">
                <span className="text-white">●</span>
              </div>
              <div>
                <p className="text-white text-sm">Out for Delivery</p>
                <p className="text-gray-400 text-xs">Today, 11:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                <span className="text-white">○</span>
              </div>
              <div>
                <p className="text-white text-sm">Delivered</p>
                <p className="text-gray-400 text-xs">Estimated: Today, 11:30 AM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mb-6">
          <Button 
            variant="outline" 
            className="flex-1 border-zepmeds-purple text-zepmeds-purple"
            onClick={handleDownloadInvoice}
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-red-500 text-red-500"
            onClick={handleReportIssue}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
        
        <div className="glass-morphism rounded-xl p-4 mb-6">
          <h3 className="text-white font-medium mb-3">FAQ</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-black/20 rounded-lg">
              <h4 className="text-white text-sm font-medium mb-1">How do I cancel my order?</h4>
              <p className="text-gray-400 text-xs">You can cancel your order within 5 minutes of placing it. Go to Order History and select "Cancel Order".</p>
            </div>
            
            <div className="p-3 bg-black/20 rounded-lg">
              <h4 className="text-white text-sm font-medium mb-1">What if I'm not available during delivery?</h4>
              <p className="text-gray-400 text-xs">You can reschedule delivery or ask the delivery partner to leave it with your security guard/neighbor.</p>
            </div>
            
            <div className="p-3 bg-black/20 rounded-lg">
              <h4 className="text-white text-sm font-medium mb-1">What if I receive incorrect medicines?</h4>
              <p className="text-gray-400 text-xs">Please report the issue immediately using the "Report Issue" button and our team will assist you.</p>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default TrackOrder;
