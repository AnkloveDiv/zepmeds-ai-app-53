
import React from "react";
import { CreditCard } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import CodPayment from "./CodPayment";
import CardPayment from "./CardPayment";
import BnplPayment from "./BnplPayment";
import UpiPayment from "./UpiPayment";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
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
  bnplProvider: string;
  setBnplProvider: (provider: string) => void;
  showBnplDetails: boolean;
  setShowBnplDetails: (show: boolean) => void;
  upiProvider: string;
  setUpiProvider: (provider: string) => void;
  showUpiDetails: boolean;
  setShowUpiDetails: (show: boolean) => void;
}

const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
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
  bnplProvider,
  setBnplProvider,
  showBnplDetails,
  setShowBnplDetails,
  upiProvider,
  setUpiProvider,
  showUpiDetails,
  setShowUpiDetails,
}: PaymentMethodsProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <CreditCard className="mr-2 text-blue-400" size={20} />
        Payment Method
      </h2>
      
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
        <CodPayment isSelected={paymentMethod === "cod"} />
        
        <CardPayment 
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardName={cardName}
          setCardName={setCardName}
          cardExpiry={cardExpiry}
          setCardExpiry={setCardExpiry}
          cardCvv={cardCvv}
          setCvv={setCvv}
          showCardDetails={showCardDetails}
          setShowCardDetails={setShowCardDetails}
          isSelected={paymentMethod === "card"}
          onSelect={() => setPaymentMethod("card")}
        />
        
        <BnplPayment 
          bnplProvider={bnplProvider}
          setBnplProvider={setBnplProvider}
          showBnplDetails={showBnplDetails}
          setShowBnplDetails={setShowBnplDetails}
          isSelected={paymentMethod === "bnpl"}
          onSelect={() => setPaymentMethod("bnpl")}
        />
        
        <UpiPayment 
          upiProvider={upiProvider}
          setUpiProvider={setUpiProvider}
          showUpiDetails={showUpiDetails}
          setShowUpiDetails={setShowUpiDetails}
          isSelected={paymentMethod === "upi"}
          onSelect={() => setPaymentMethod("upi")}
        />
      </RadioGroup>
    </div>
  );
};

export default PaymentMethods;
