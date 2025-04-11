
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  
  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF
    // For now, we'll just show a toast
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order #${orderId} has been downloaded.`,
    });
    
    // Create a simple text version of the invoice for demo purposes
    const invoiceText = `
ZEPMEDS INVOICE
--------------
Order ID: ${orderId}
Date: ${orderDate}
--------------
Items:
${items.map(item => `${item.name} x${item.quantity} - ₹${item.price.toFixed(2)}`).join('\n')}
--------------
Total: ₹${totalAmount.toFixed(2)}
--------------
Thank you for shopping with Zepmeds!
    `;
    
    // Create a blob and download it
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zepmeds_invoice_${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-zepmeds-purple border-zepmeds-purple/30 hover:bg-zepmeds-purple/10"
      onClick={handleDownloadInvoice}
    >
      <FileDown className="h-4 w-4 mr-1" />
      Download Invoice
    </Button>
  );
};

export default OrderInvoice;
