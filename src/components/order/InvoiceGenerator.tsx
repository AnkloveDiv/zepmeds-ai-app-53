
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileDown, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

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
  
  const formattedDate = new Date(orderDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
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
        logging: false
      });
      
      // Convert to image and download
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const a = document.createElement('a');
      a.href = image;
      a.download = `zepmeds_invoice_${orderId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Invoice Downloaded",
        description: `Invoice for order #${orderId} has been downloaded.`,
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
      <div className="absolute left-[-9999px]">
        <div 
          ref={invoiceRef} 
          className="bg-white text-black p-8 w-[800px]"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-1">ZEPMEDS</h1>
              <p className="text-sm text-gray-600">Medicine Delivery Services</p>
              <p className="text-sm text-gray-600">123 Health Street, Medical District</p>
              <p className="text-sm text-gray-600">Bengaluru, Karnataka 560001</p>
              <p className="text-sm text-gray-600">GST: 29AABCZ4567R1ZX</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">INVOICE</h2>
              <p className="text-sm text-gray-600 mt-1">Invoice #: {orderId}</p>
              <p className="text-sm text-gray-600">Date: {formattedDate}</p>
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            </div>
          </div>
          
          {/* Customer Details */}
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h3 className="text-gray-700 font-medium mb-2">Bill To:</h3>
            <p className="text-sm text-gray-600">{customerName}</p>
            <p className="text-sm text-gray-600">{customerAddress}</p>
          </div>
          
          {/* Items Table */}
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border border-gray-200">Item</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border border-gray-200">Qty</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-200">Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-700 border border-gray-200">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border border-gray-200">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700 border border-gray-200">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700 border border-gray-200">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2">
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm text-gray-700">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Delivery Fee:</span>
                <span className="text-sm text-gray-700">₹{deliveryFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm text-green-600">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="text-base font-semibold text-gray-700">Total:</span>
                <span className="text-base font-semibold text-gray-700">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm text-gray-700">{paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className={`text-sm ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                  {isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
            <p>Thank you for shopping with ZepMeds!</p>
            <p className="mt-1">For any questions regarding this invoice, please contact our support at support@zepmeds.com</p>
            <p className="font-medium mt-2">This is a computer-generated invoice and does not require a signature.</p>
          </div>
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
