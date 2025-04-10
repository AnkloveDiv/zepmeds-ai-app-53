
import { useState } from "react";
import DeliveryAnimation from "@/components/DeliveryAnimation";
import DeliveryMap from "@/components/DeliveryMap";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const DeliveryTracking = () => {
  const [showMap, setShowMap] = useState(false);
  
  return (
    <div className="my-4 p-3 rounded-xl glass-morphism">
      {showMap ? (
        <div className="h-32">
          <DeliveryMap showRider={true} />
        </div>
      ) : (
        <DeliveryAnimation />
      )}
      
      <div className="flex justify-end mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center text-zepmeds-purple"
          onClick={() => setShowMap(!showMap)}
        >
          <MapPin className="h-3 w-3 mr-1" />
          {showMap ? "Hide map" : "Show on map"}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryTracking;
