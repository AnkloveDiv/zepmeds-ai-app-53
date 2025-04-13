
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
    </div>
  );
};

export default AlertMessages;
