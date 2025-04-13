
import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import AddressSection from './AddressSection';
import LegalInfo from './LegalInfo';
import ItemsTable from './ItemsTable';
import TotalSection from './TotalSection';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceTemplateProps {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: string;
}

const InvoiceTemplate = ({
  orderId,
  orderDate,
  customerName,
  customerAddress,
  items,
  subtotal,
  deliveryFee,
  discount,
  totalAmount,
  isPaid,
  paymentMethod
}: InvoiceTemplateProps) => {
  return (
    <div 
      className="bg-white text-black p-8 w-[800px]"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <InvoiceHeader orderId={orderId} orderDate={orderDate} />
      <AddressSection customerName={customerName} customerAddress={customerAddress} />
      <LegalInfo />
      <ItemsTable items={items} />
      <TotalSection 
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        discount={discount}
        totalAmount={totalAmount} 
        isPaid={isPaid} 
        paymentMethod={paymentMethod} 
      />
      <InvoiceFooter />
    </div>
  );
};

export default InvoiceTemplate;
