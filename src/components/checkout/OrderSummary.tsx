
import React from "react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  finalAmount: number;
  loading: boolean;
  selectedAddress: string | null;
  requiresPrescription: boolean;
  prescriptionUrl: string | null;
  onPlaceOrder: () => void;
}

const OrderSummary = ({
  finalAmount,
  loading,
  selectedAddress,
  requiresPrescription,
  prescriptionUrl,
  onPlaceOrder
}: OrderSummaryProps) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 glass-morphism border-t border-white/10 backdrop-blur-lg z-20 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Total Amount</p>
          <p className="text-white text-xl font-bold">₹{finalAmount.toFixed(2)}</p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 shadow-md"
          onClick={onPlaceOrder}
          disabled={loading || !selectedAddress || (requiresPrescription && !prescriptionUrl)}
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
