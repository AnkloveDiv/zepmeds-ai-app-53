
import React from 'react';

interface InvoiceHeaderProps {
  orderId: string;
  orderDate: string;
}

const InvoiceHeader = ({ orderId, orderDate }: InvoiceHeaderProps) => {
  const formattedDate = new Date(orderDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {/* Header with logo and title */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div className="flex items-center">
          <span className="text-3xl font-bold">ZEPMEDS</span>
          <span className="text-xl ml-1 text-green-600">.in</span>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h2>
          <p className="text-sm">(Original for Recipient)</p>
        </div>
      </div>
      
      {/* Order details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm"><span className="font-bold">Order Number:</span> {orderId}</p>
          <p className="text-sm"><span className="font-bold">Order Date:</span> {formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm"><span className="font-bold">Invoice Number:</span> INV-{orderId}</p>
          <p className="text-sm"><span className="font-bold">Invoice Date:</span> {formattedDate}</p>
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;
