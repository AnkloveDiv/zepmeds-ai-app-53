
import React from "react";
import { Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { UPI_PROVIDERS } from "@/constants";

interface UpiPaymentProps {
  upiProvider: string;
  setUpiProvider: (provider: string) => void;
  showUpiDetails: boolean;
  setShowUpiDetails: (show: boolean) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const UpiPayment = ({
  upiProvider,
  setUpiProvider,
  showUpiDetails,
  setShowUpiDetails,
  isSelected,
  onSelect
}: UpiPaymentProps) => {
  return (
    <div className={`rounded-xl transition-all ${
      isSelected
        ? "border-green-500 bg-green-900/30"
        : "border-gray-700 bg-black/40"
    }`}>
      <div className="p-4" onClick={() => {
        onSelect();
        setShowUpiDetails(true);
      }}>
        <div className="flex items-center">
          <RadioGroupItem value="upi" id="upi" className="text-green-400 mr-3" />
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-green-400 mr-2" />
            <Label htmlFor="upi" className="text-white font-medium">UPI Payment</Label>
          </div>
        </div>
      </div>
      
      {isSelected && showUpiDetails && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="bg-blue-800/50 my-3" />
          
          <div>
            <Label htmlFor="upiProvider" className="text-gray-400 text-sm">Select Provider</Label>
            <RadioGroup value={upiProvider} onValueChange={setUpiProvider} className="space-y-2">
              {UPI_PROVIDERS.map((provider) => (
                <div key={provider.id} className="flex items-center">
                  <div className="mr-3">
                    <RadioGroupItem 
                      value={provider.id} 
                      id={`upi-provider-${provider.id}`} 
                      className="text-green-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className={`mr-2 w-6 h-6 rounded-full flex items-center justify-center ${provider.iconBg}`}>
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{provider.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpiPayment;
