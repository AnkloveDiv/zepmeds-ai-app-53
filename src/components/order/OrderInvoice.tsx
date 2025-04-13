
import InvoiceGenerator from "./InvoiceGenerator";

interface OrderInvoiceProps {
  orderId: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

const OrderInvoice = ({ orderId, orderDate, items, totalAmount }: OrderInvoiceProps) => {
  // Calculate subtotal and delivery fee for display in invoice
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50; // Fixed delivery fee
  const discount = 0; // No discount by default
  
  // Customer details - in a real app, these would come from the user's account
  const customerName = "Rahul Sharma";
  const customerAddress = "123 Main St, Apartment 4B, Bengaluru, KA 560001";
  
  return (
    <InvoiceGenerator
      orderId={orderId}
      orderDate={orderDate}
      customerName={customerName}
      customerAddress={customerAddress}
      items={items}
      subtotal={subtotal}
      deliveryFee={deliveryFee}
      discount={discount}
      totalAmount={totalAmount}
      isPaid={true}
      paymentMethod="Cash on Delivery"
    />
  );
};

export default OrderInvoice;
