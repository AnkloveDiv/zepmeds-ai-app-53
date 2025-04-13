
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapOverlaysProps {
  usingMockData: boolean;
  isLoading: boolean;
  handleCurrentLocation: () => void;
  showAccuracyWarning?: boolean;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({ 
  usingMockData, 
  isLoading, 
  handleCurrentLocation,
  showAccuracyWarning = false // Default to false to disable warnings
}) => {
  if (usingMockData || isLoading) {
    return null;
  }
  
  return (
    <>
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="sm"
          variant="outline"
          className="bg-black/70 text-white border-gray-700 hover:bg-black/90"
          onClick={handleCurrentLocation}
        >
          <Navigation className="mr-2 h-4 w-4 text-green-500" />
          My Location
        </Button>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/70 px-3 py-2 rounded-full text-white text-sm flex items-center shadow-lg">
          <MapPin className="h-4 w-4 text-red-500 mr-2" />
          <span>Drag marker or tap to select location</span>
        </div>
      </div>
    </>
  );
};

export default MapOverlays;
