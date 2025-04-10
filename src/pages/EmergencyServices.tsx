
import { useState } from "react";
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

const EmergencyServices = () => {
  useBackNavigation();
  const { toast } = useToast();
  
  const [emergency, setEmergency] = useState({
    type: "ambulance",
    confirmation: "",
    status: "idle", // idle, confirming, dispatched
  });
  
  const [eta, setEta] = useState(12); // minutes
  
  const handleConfirmEmergency = () => {
    if (emergency.confirmation.toLowerCase() !== "yes") {
      toast({
        title: "Error",
        description: "Please type 'yes' to confirm emergency services",
        variant: "destructive"
      });
      return;
    }
    
    setEmergency({ ...emergency, status: "confirming" });
    
    // Simulate API call
    setTimeout(() => {
      setEmergency({ ...emergency, status: "dispatched" });
      toast({
        title: "Emergency Services Dispatched",
        description: "Help is on the way! ETA: 12 minutes",
      });
    }, 2000);
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
                    onClick={() => setEmergency({ type: "ambulance", confirmation: "", status: "idle" })}
                  >
                    Cancel Emergency Request
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-white font-medium mb-2">Other Emergency Services</h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
