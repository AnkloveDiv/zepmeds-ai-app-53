
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
          
          {/* Company and Customer details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-bold mb-2">Sold By:</h3>
              <p className="text-sm">ZepMeds India Private Limited</p>
              <p className="text-sm">Sy No. 524/1,2,3,4,6, 525/1,2,3,4,5,6</p>
              <p className="text-sm">526/3,4,5,6,527 of madivala village and</p>
              <p className="text-sm">Sy no 51/1 of thatanahhalli village</p>
              <p className="text-sm">Bengaluru urban district</p>
              <p className="text-sm">Bengaluru, Karnataka, 560001</p>
              <p className="text-sm">IN</p>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="font-bold mb-2">Billing Address:</h3>
                <p className="text-sm">{customerName}</p>
                <p className="text-sm">{customerAddress}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Shipping Address:</h3>
                <p className="text-sm">{customerAddress}</p>
              </div>
            </div>
          </div>
          
          {/* Legal Info */}
          <div className="border rounded-md p-3 mb-6 bg-gray-50">
            <p className="text-sm mb-1"><span className="font-bold">PAN No:</span> AAOCZM8765Q</p>
            <p className="text-sm"><span className="font-bold">GST Registration No:</span> 29AAOCZM8765Q1Z8</p>
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
          
          {/* Items Table */}
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
          
          {/* Totals */}
          <div className="flex justify-end mb-8 border-t pt-4">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-sm font-bold">TOTAL:</span>
                <span className="text-sm font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="mt-3 mb-2">
                <p className="text-sm font-bold">Amount in Words:</p>
                <p className="text-sm">Rupees {convertToWords(totalAmount)} only</p>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm">
                  <p>{isPaid ? "Paid" : "Unpaid"}</p>
                  <p>Method: {paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold mb-8">For ZepMeds India Private Limited:</p>
                  <p className="text-sm">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs border-t pt-4 text-gray-600">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
            <p className="mt-1">For questions regarding this invoice, please contact our support at support@zepmeds.com</p>
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

// Helper function to convert number to words
function convertToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", 
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const numString = Math.floor(amount).toString();
  
  if (amount < 20) {
    return ones[amount];
  }
  
  if (amount < 100) {
    return tens[Math.floor(amount / 10)] + (amount % 10 ? " " + ones[amount % 10] : "");
  }
  
  if (amount < 1000) {
    return ones[Math.floor(amount / 100)] + " Hundred" + (amount % 100 ? " And " + convertToWords(amount % 100) : "");
  }
  
  if (amount < 100000) {
    return convertToWords(Math.floor(amount / 1000)) + " Thousand" + (amount % 1000 ? " " + convertToWords(amount % 1000) : "");
  }
  
  if (amount < 10000000) {
    return convertToWords(Math.floor(amount / 100000)) + " Lakh" + (amount % 100000 ? " " + convertToWords(amount % 100000) : "");
  }
  
  return convertToWords(Math.floor(amount / 10000000)) + " Crore" + (amount % 10000000 ? " " + convertToWords(amount % 10000000) : "");
}

export default InvoiceGenerator;
