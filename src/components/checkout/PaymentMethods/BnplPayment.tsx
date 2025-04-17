
import React from "react";
import { Server } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { BNPL_PROVIDERS } from "@/constants";

interface BnplPaymentProps {
  bnplProvider: string;
  setBnplProvider: (provider: string) => void;
  showBnplDetails: boolean;
  setShowBnplDetails: (show: boolean) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const BnplPayment = ({
  bnplProvider,
  setBnplProvider,
  showBnplDetails,
  setShowBnplDetails,
  isSelected,
  onSelect
}: BnplPaymentProps) => {
  return (
    <div className={`rounded-xl transition-all ${
      isSelected
        ? "border-purple-500 bg-purple-900/30"
        : "border-gray-700 bg-black/40"
    }`}>
      <div className="p-4" onClick={() => {
        onSelect();
        setShowBnplDetails(true);
      }}>
        <div className="flex items-center">
          <RadioGroupItem value="bnpl" id="bnpl" className="text-purple-400 mr-3" />
          <div className="flex items-center">
            <Server className="h-5 w-5 text-purple-400 mr-2" />
            <Label htmlFor="bnpl" className="text-white font-medium">Buy Now Pay Later</Label>
          </div>
        </div>
      </div>
      
      {isSelected && showBnplDetails && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="bg-blue-800/50 my-3" />
          
          <div>
            <Label htmlFor="bnplProvider" className="text-gray-400 text-sm">Select Provider</Label>
            <RadioGroup value={bnplProvider} onValueChange={setBnplProvider} className="space-y-2">
              {BNPL_PROVIDERS.map((provider) => (
                <div key={provider.id} className="flex items-center">
                  <div className="mr-3">
                    <RadioGroupItem 
                      value={provider.id} 
                      id={`bnpl-provider-${provider.id}`} 
                      className="text-purple-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className={`mr-2 w-6 h-6 rounded-full flex items-center justify-center ${provider.iconBg}`}>
                        <Server className="h-4 w-4 text-white" />
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

export default BnplPayment;
