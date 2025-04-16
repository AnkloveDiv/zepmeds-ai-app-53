import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ambulance, Phone, MapPin, Clock } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";
import useBackNavigation from "@/hooks/useBackNavigation";
import { useToast } from "@/components/ui/use-toast";
import { useEmergencyService } from "@/services/emergencyService";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { sendEmergencyRequest } from "@/services/orders/utils";

const EmergencyServices = () => {
  useBackNavigation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    requestEmergencyService, 
    cancelEmergencyRequest, 
    loading, 
    error, 
    ambulance, 
    eta: serviceEta 
  } = useEmergencyService();
  
  const [emergency, setEmergency] = useState({
    type: "ambulance",
    confirmation: "",
    status: "idle", // idle, confirming, dispatched
    requestId: null as string | null,
    description: "",
    location: ""
  });
  
  const [eta, setEta] = useState(12); // minutes
  
  // Use the ETA from the service if available
  useEffect(() => {
    if (serviceEta) {
      setEta(serviceEta);
    }
  }, [serviceEta]);
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  const handleConfirmEmergency = async () => {
    if (emergency.confirmation.toLowerCase() !== "yes") {
      toast({
        title: "Error",
        description: "Please type 'yes' to confirm emergency services",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to request emergency services",
        variant: "destructive"
      });
      return;
    }
    
    setEmergency({ ...emergency, status: "confirming" });
    
    try {
      // Get user information from auth context
      const userName = user?.name || "Unknown User";
      const userPhone = user?.phoneNumber || "Unknown Phone";
      
      // Send emergency request to Supabase
      const response = await sendEmergencyRequest(
        userName,
        userPhone,
        emergency.description
      );
      
      if (response) {
        setEmergency({ 
          ...emergency, 
          status: "dispatched", 
          requestId: response.id 
        });
        
        toast({
          title: "Emergency Services Dispatched",
          description: `Help is on the way! ETA: ${serviceEta || eta} minutes`,
        });
        
        // Also trigger the existing emergency service for backward compatibility
        await requestEmergencyService({
          request_type: emergency.type,
          status: 'requested',
          description: emergency.description || "Emergency assistance needed"
        });
      } else {
        // If response is null but no error was set, we still need to handle the failure
        setEmergency({ ...emergency, status: "idle" });
        
        toast({
          title: "Request Failed",
          description: "Unable to request emergency services. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error requesting emergency services:", err);
      setEmergency({ ...emergency, status: "idle" });
      
      toast({
        title: "Request Failed",
        description: "An error occurred while requesting emergency services.",
        variant: "destructive"
      });
    }
  };
  
  const handleCancelEmergency = async () => {
    if (emergency.requestId) {
      try {
        await cancelEmergencyRequest(emergency.requestId);
        setEmergency({ 
          type: "ambulance", 
          confirmation: "", 
          status: "idle",
          requestId: null,
          description: "",
          location: ""
        });
        
        toast({
          title: "Emergency Request Cancelled",
          description: "Your emergency service request has been cancelled.",
        });
      } catch (err) {
        console.error("Error cancelling emergency request:", err);
        toast({
          title: "Error",
          description: "Failed to cancel emergency request.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Emergency Services" />
      
      <main className="px-4 py-6">
        <div className="mb-6">
          <Card className="bg-red-500/10 border border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                  <Ambulance className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Emergency Assistance</h2>
                  <p className="text-gray-400 text-sm">For life-threatening emergencies</p>
                </div>
              </div>
              
              {emergency.status === "idle" && (
                <>
                  <p className="text-white mb-4">
                    This will dispatch emergency medical services to your current location immediately.
                    Only use this service for genuine medical emergencies.
                  </p>
                  
                  <div className="mb-4">
                    <Label htmlFor="description" className="text-white">Describe your emergency (optional)</Label>
                    <Textarea 
                      id="description" 
                      value={emergency.description}
                      onChange={(e) => setEmergency({ ...emergency, description: e.target.value })}
                      className="bg-black/20 border-white/10 mt-1"
                      placeholder="What's happening? Any relevant medical information..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="confirmation" className="text-white">Type "yes" to confirm emergency services</Label>
                    <Input 
                      id="confirmation" 
                      value={emergency.confirmation}
                      onChange={(e) => setEmergency({ ...emergency, confirmation: e.target.value })}
                      className="bg-black/20 border-white/10 mt-1"
                      placeholder="Type 'yes' to confirm"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleConfirmEmergency}
                  >
                    Request Emergency Services
                  </Button>
                </>
              )}
              
              {emergency.status === "confirming" && (
                <div className="text-center py-6">
                  <div className="animate-spin h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-white">Dispatching emergency services...</p>
                </div>
              )}
              
              {emergency.status === "dispatched" && (
                <>
                  <div className="mb-4">
                    <h3 className="text-white font-medium">Ambulance Dispatched</h3>
                    <div className="flex items-center text-gray-300 mt-2">
                      <MapPin className="h-4 w-4 mr-1 text-red-400" />
                      <span>Current Location</span>
                    </div>
                    <div className="flex items-center text-gray-300 mt-1">
                      <Clock className="h-4 w-4 mr-1 text-red-400" />
                      <span>ETA: {eta} minutes</span>
                    </div>
                  </div>
                  
                  <div className="h-60 rounded-lg overflow-hidden mb-4">
                    <DeliveryMap />
                  </div>
                  
                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 mb-2"
                    onClick={() => window.location.href = "tel:102"}
                  >
                    <Phone className="h-4 w-4" /> Emergency Call (102)
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5"
                    onClick={handleCancelEmergency}
                  >
                    Cancel Emergency Request
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 mb-20">
          <h3 className="text-white font-medium mb-2">Other Emergency Services</h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <Button 
              variant="outline" 
              className="w-full py-6 border-white/10 text-white hover:bg-white/5 flex items-start justify-between"
              onClick={() => window.location.href = "tel:102"}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Emergency Hotline</h4>
                  <p className="text-sm text-gray-400">Medical emergency: 102</p>
                </div>
              </div>
              <div className="bg-black/20 px-2 py-1 rounded text-xs">Call Now</div>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Button 
              variant="outline" 
              className="w-full py-6 border-white/10 text-white hover:bg-white/5 flex items-start justify-between"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Nearest Hospitals</h4>
                  <p className="text-sm text-gray-400">Find hospitals near you</p>
                </div>
              </div>
              <div className="bg-black/20 px-2 py-1 rounded text-xs">View Map</div>
            </Button>
          </motion.div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default EmergencyServices;
