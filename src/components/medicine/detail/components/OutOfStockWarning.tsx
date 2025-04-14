
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface OutOfStockWarningProps {
  visible: boolean;
}

const OutOfStockWarning: React.FC<OutOfStockWarningProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="mb-3 bg-red-900/30 border border-red-800 rounded-md p-3 flex items-center">
      <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
      <p className="text-red-200 text-sm font-medium">Not in stock right now, we will notify you</p>
    </div>
  );
};

export default OutOfStockWarning;
