
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AlertMessagesProps {
  error: string | null;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-20">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertMessages;
