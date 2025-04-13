
import React from 'react';
import { numberToWords } from '../utils/numberToWords';

interface TotalSectionProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: string;
}

const TotalSection = ({ 
  subtotal, 
  deliveryFee, 
  discount, 
  totalAmount, 
  isPaid, 
  paymentMethod 
}: TotalSectionProps) => {
  // Calculate GST (18% in India)
  const gstRate = 0.18;
  const gstAmount = Math.round(subtotal * gstRate);
  const totalInWords = numberToWords(totalAmount);
  
  return (
    <div className="mb-8">
      <div className="flex justify-end">
        <table className="w-1/2 text-right">
          <tbody>
            <tr>
              <td className="py-1 pr-4">Subtotal:</td>
              <td className="py-1 font-medium">₹{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4">GST (18%):</td>
              <td className="py-1 font-medium">₹{gstAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4">Delivery Fee:</td>
              <td className="py-1 font-medium">₹{deliveryFee.toFixed(2)}</td>
            </tr>
            {discount > 0 && (
              <tr>
                <td className="py-1 pr-4 text-green-600">Discount:</td>
                <td className="py-1 font-medium text-green-600">-₹{discount.toFixed(2)}</td>
              </tr>
            )}
            <tr className="border-t">
              <td className="py-2 pr-4 font-bold">Total:</td>
              <td className="py-2 font-bold">₹{totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded border">
        <p className="text-sm font-medium">Amount in Words: <span className="font-normal">{totalInWords} Only</span></p>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-sm font-medium">Payment Method: <span className="font-normal">{paymentMethod}</span></p>
          <p className="text-sm font-medium mt-1">Payment Status: 
            <span className={`font-normal ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
              {isPaid ? ' Paid' : ' Pending'}
            </span>
          </p>
        </div>
        
        {isPaid && (
          <div className="border-2 border-green-600 rounded px-3 py-1 rotate-[-20deg]">
            <p className="text-green-600 font-bold text-xl">PAID</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalSection;
