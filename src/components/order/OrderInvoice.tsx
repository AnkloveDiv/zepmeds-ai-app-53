
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  
  // Calculate subtotal and delivery fee for display in invoice
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = Math.round(subtotal * 0.1); // Example: 10% of subtotal for delivery
  
  // Example customer details
  const customerName = "John Doe";
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
      discount={0} // Set to appropriate value if there's a discount
      totalAmount={totalAmount}
      isPaid={true}
      paymentMethod="Cash on Delivery"
    />
  );
};

export default OrderInvoice;
