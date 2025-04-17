
import React from "react";
import { DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface CodPaymentProps {
  isSelected: boolean;
}

const CodPayment = ({ isSelected }: CodPaymentProps) => {
  return (
    <div className={`p-4 rounded-xl transition-all ${
      isSelected 
        ? "border-orange-500 bg-orange-900/30" 
        : "border-gray-700 bg-black/40"
    }`}>
      <div className="flex items-center">
        <RadioGroupItem value="cod" id="cod" className="text-orange-400 mr-3" />
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-orange-400 mr-2" />
          <Label htmlFor="cod" className="text-white font-medium">Cash on Delivery</Label>
        </div>
      </div>
    </div>
  );
};

export default CodPayment;
