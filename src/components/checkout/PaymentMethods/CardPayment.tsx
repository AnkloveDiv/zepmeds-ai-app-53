
import React from "react";
import { CreditCard, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface CardPaymentProps {
  cardNumber: string;
  setCardNumber: (number: string) => void;
  cardName: string;
  setCardName: (name: string) => void;
  cardExpiry: string;
  setCardExpiry: (expiry: string) => void;
  cardCvv: string;
  setCvv: (cvv: string) => void;
  showCardDetails: boolean;
  setShowCardDetails: (show: boolean) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const CardPayment = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCvv,
  showCardDetails,
  setShowCardDetails,
  isSelected,
  onSelect
}: CardPaymentProps) => {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className={`rounded-xl transition-all ${
      isSelected 
        ? "border-blue-500 bg-blue-900/30" 
        : "border-gray-700 bg-black/40"
    }`}>
      <div className="p-4" onClick={() => {
        onSelect();
        setShowCardDetails(true);
      }}>
        <div className="flex items-center">
          <RadioGroupItem value="card" id="card" className="text-blue-400 mr-3" />
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-blue-400 mr-2" />
            <Label htmlFor="card" className="text-white font-medium">Credit / Debit Card</Label>
          </div>
        </div>
      </div>
      
      {isSelected && showCardDetails && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="bg-blue-800/50 my-3" />
          
          <div>
            <Label htmlFor="cardNumber" className="text-gray-400 text-sm">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="bg-black/40 border-gray-700 text-white mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cardName" className="text-gray-400 text-sm">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="bg-black/40 border-gray-700 text-white mt-1"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="cardExpiry" className="text-gray-400 text-sm">Expiry Date</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                maxLength={5}
                className="bg-black/40 border-gray-700 text-white mt-1"
              />
            </div>
            
            <div className="w-1/3">
              <Label htmlFor="cardCvv" className="text-gray-400 text-sm">CVV</Label>
              <Input
                id="cardCvv"
                type="password"
                placeholder="123"
                value={cardCvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                maxLength={3}
                className="bg-black/40 border-gray-700 text-white mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPayment;
