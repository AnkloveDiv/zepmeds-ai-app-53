
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';

interface MapOverlaysProps {
  isGettingLocation: boolean;
  getMyLocation: () => void;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({
  isGettingLocation,
  getMyLocation
}) => {
  return (
    <div className="absolute right-4 bottom-4 z-10">
      <Button
        variant="outline"
        size="icon"
        className="bg-black/50 border-gray-700 hover:bg-black/70"
        onClick={getMyLocation}
        disabled={isGettingLocation}
      >
        {isGettingLocation ? (
          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
        ) : (
          <Navigation className="h-5 w-5 text-blue-400" />
        )}
      </Button>
    </div>
  );
};

export default MapOverlays;
