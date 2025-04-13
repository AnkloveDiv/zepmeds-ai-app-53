
import React from 'react';

const InvoiceFooter = () => {
  return (
    <div className="text-center text-xs border-t pt-4 text-gray-600">
      <p>This is a computer-generated invoice and does not require a physical signature.</p>
      <p className="mt-1">For questions regarding this invoice, please contact our support at support@zepmeds.com</p>
      <p className="mt-1">Thank you for shopping with ZepMeds! Your health is our priority.</p>
    </div>
  );
};

export default InvoiceFooter;
