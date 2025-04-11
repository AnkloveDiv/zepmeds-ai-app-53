
import { Button } from "@/components/ui/button";
import { FileDown, HelpCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OrderActionsProps {
  orderId: string;
  compact?: boolean;
}

const OrderActions = ({ orderId, compact = false }: OrderActionsProps) => {
  const { toast } = useToast();
  
  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order #${orderId} has been downloaded.`,
    });
    
    // In a real app, this would download a PDF
    const invoiceText = `
ZEPMEDS INVOICE
--------------
Order ID: ${orderId}
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
  
  const handleGetSupport = () => {
    toast({
      title: "Support Request Sent",
      description: "A support agent will contact you shortly.",
    });
  };
  
  const handleRaiseIssue = () => {
    toast({
      title: "Issue Reported",
      description: "We'll look into this and get back to you soon.",
      variant: "destructive",
    });
  };
  
  if (compact) {
    return (
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-green-500 border-green-500/30 hover:bg-green-500/10"
          onClick={handleDownloadInvoice}
        >
          <FileDown className="h-4 w-4 mr-1" />
          Invoice
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
          onClick={handleGetSupport}
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Help
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
          onClick={handleRaiseIssue}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Issue
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 w-full">
      <Button 
        variant="outline" 
        className="w-full justify-start text-green-500 border-green-500/30 hover:bg-green-500/10"
        onClick={handleDownloadInvoice}
      >
        <FileDown className="h-5 w-5 mr-2" />
        Download Invoice
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
        onClick={handleGetSupport}
      >
        <HelpCircle className="h-5 w-5 mr-2" />
        Help & Support
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start text-red-500 border-red-500/30 hover:bg-red-500/10"
        onClick={handleRaiseIssue}
      >
        <AlertTriangle className="h-5 w-5 mr-2" />
        Report an Issue
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Chat with Support
      </Button>
    </div>
  );
};

export default OrderActions;
