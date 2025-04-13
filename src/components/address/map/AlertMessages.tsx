
import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertMessagesProps {
  locationPermissionDenied: boolean;
  showingAccuracyHelp: boolean;
  disableAccuracyWarnings?: boolean;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ 
  locationPermissionDenied, 
  showingAccuracyHelp,
  disableAccuracyWarnings = true // Default to true to disable accuracy warnings
}) => {
  return (
    <>
      {locationPermissionDenied && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Location access denied</AlertTitle>
          <AlertDescription>
            Enable location access in your browser settings to get accurate location data. Until then, you can manually select a location on the map.
          </AlertDescription>
        </Alert>
      )}
      
      {!disableAccuracyWarnings && showingAccuracyHelp && (
        <Alert variant="warning" className="mb-4">
          <Info className="h-5 w-5" />
          <AlertTitle>Improve location accuracy</AlertTitle>
          <AlertDescription>
            <p className="mb-2">To get better location accuracy:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Enable GPS on your device</li>
              <li>Move to an area with better GPS signal (near windows or outdoors)</li>
              <li>Try another browser (Chrome often has best location accuracy)</li>
              <li>Manually adjust the pin to your exact location</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
