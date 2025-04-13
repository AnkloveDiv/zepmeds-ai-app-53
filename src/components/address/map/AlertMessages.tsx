
import React from 'react';
import { AlertCircle, MapPin, WifiOff } from 'lucide-react';

interface AlertMessagesProps {
  error: string | null;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ error }) => {
  if (!error) return null;
  
  // Different styling based on error types
  let Icon = AlertCircle;
  let bgColor = 'bg-red-900/70';
  let textColor = 'text-red-200';
  let borderColor = 'border-red-700';
  
  if (error.includes('location') || error.includes('Location')) {
    Icon = MapPin;
    bgColor = 'bg-amber-900/70';
    textColor = 'text-amber-200';
    borderColor = 'border-amber-700';
  } else if (error.includes('internet') || error.includes('connection')) {
    Icon = WifiOff;
    bgColor = 'bg-blue-900/70';
    textColor = 'text-blue-200';
    borderColor = 'border-blue-700';
  }
  
  return (
    <div className={`absolute inset-x-0 top-1/3 z-20 mx-auto max-w-[90%] transform -translate-y-1/2 ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-6 w-6 ${textColor}`} />
        <div className={`${textColor} font-medium`}>
          {error}
        </div>
      </div>
      
      {error.includes('API key') && (
        <div className="mt-2 text-sm text-white/80">
          <p>Note: For this demo app, you'll need to enable billing for the Google Maps API key.</p>
          <a href="https://developers.google.com/maps/documentation/javascript/error-messages#billing-errors" 
             target="_blank" 
             rel="noopener noreferrer"
             className="block mt-1 underline text-blue-300">
            Learn how to fix this
          </a>
        </div>
      )}
    </div>
  );
};

export default AlertMessages;
