
import React from 'react';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface ItemsTableProps {
  items: InvoiceItem[];
}

const ItemsTable = ({ items }: ItemsTableProps) => {
  return (
    <table className="w-full mb-6 border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2 text-left text-sm">Sl. No.</th>
          <th className="border border-gray-300 p-2 text-left text-sm">Description</th>
          <th className="border border-gray-300 p-2 text-center text-sm">Unit Price</th>
          <th className="border border-gray-300 p-2 text-center text-sm">Qty</th>
          <th className="border border-gray-300 p-2 text-right text-sm">Net Amount</th>
          <th className="border border-gray-300 p-2 text-center text-sm">Tax Rate</th>
          <th className="border border-gray-300 p-2 text-center text-sm">Tax Type</th>
          <th className="border border-gray-300 p-2 text-right text-sm">Tax Amount</th>
          <th className="border border-gray-300 p-2 text-right text-sm">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const taxRate = 18; // 18% GST
          const itemNetAmount = item.price * item.quantity;
          const taxAmount = (itemNetAmount * taxRate) / 100;
          const totalItemAmount = itemNetAmount + taxAmount;
          
          return (
            <tr key={index}>
              <td className="border border-gray-300 p-2 text-sm">{index + 1}</td>
              <td className="border border-gray-300 p-2 text-sm">{item.name}</td>
              <td className="border border-gray-300 p-2 text-center text-sm">₹{item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center text-sm">{item.quantity}</td>
              <td className="border border-gray-300 p-2 text-right text-sm">₹{itemNetAmount.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center text-sm">{taxRate}%</td>
              <td className="border border-gray-300 p-2 text-center text-sm">GST</td>
              <td className="border border-gray-300 p-2 text-right text-sm">₹{taxAmount.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-right text-sm">₹{totalItemAmount.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ItemsTable;
