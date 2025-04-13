
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import InvoiceTemplate from './invoice/InvoiceTemplate';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceGeneratorProps {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: string;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  orderId,
  orderDate,
  customerName,
  customerAddress,
  items,
  subtotal,
  deliveryFee,
  discount = 0,
  totalAmount,
  isPaid,
  paymentMethod
}) => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    
    try {
      toast({
        title: "Generating invoice...",
        description: "Please wait while we generate your invoice.",
      });
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false
      });
      
      // Convert to image and download
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `zepmeds_invoice_${orderId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Invoice Downloaded",
        description: `Invoice for order #${orderId} has been downloaded as JPG file.`,
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate the invoice. Please try again.",
      });
    }
  };
  
  return (
    <div className="relative">
      {/* Hidden invoice template for capturing */}
      <div className="absolute left-[-9999px]" style={{ width: "800px", height: "auto" }}>
        <div ref={invoiceRef}>
          <InvoiceTemplate
            orderId={orderId}
            orderDate={orderDate}
            customerName={customerName}
            customerAddress={customerAddress}
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            totalAmount={totalAmount}
            isPaid={isPaid}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
      
      {/* Button to generate and download invoice */}
      <Button 
        variant="outline" 
        size="sm" 
        className="text-zepmeds-purple border-zepmeds-purple/30 hover:bg-zepmeds-purple/10"
        onClick={handleDownloadInvoice}
      >
        <FileDown className="h-4 w-4 mr-1" />
        Download Invoice
      </Button>
    </div>
  );
};

export default InvoiceGenerator;
