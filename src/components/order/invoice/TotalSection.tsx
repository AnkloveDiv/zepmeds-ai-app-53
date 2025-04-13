
import React from 'react';
import { convertToWords } from '../utils/numberToWords';

interface TotalSectionProps {
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: string;
}

const TotalSection = ({ totalAmount, isPaid, paymentMethod }: TotalSectionProps) => {
  return (
    <div className="flex justify-end mb-8 border-t pt-4">
      <div className="w-64">
        <div className="flex justify-between py-1">
          <span className="text-sm font-bold">TOTAL:</span>
          <span className="text-sm font-bold">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="mt-3 mb-2">
          <p className="text-sm font-bold">Amount in Words:</p>
          <p className="text-sm">Rupees {convertToWords(totalAmount)} only</p>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm">
            <p>{isPaid ? "Paid" : "Unpaid"}</p>
            <p>Method: {paymentMethod}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold mb-8">For ZepMeds India Private Limited:</p>
            <p className="text-sm">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSection;
