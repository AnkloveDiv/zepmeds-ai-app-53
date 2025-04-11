
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, FileText, MessagesSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const OrderFAQ = () => {
  const { toast } = useToast();
  const [issueDescription, setIssueDescription] = useState("");
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  
  const handleSubmitIssue = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Please provide details",
        description: "Please describe your issue to help us assist you better.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit to a backend
    toast({
      title: "Issue reported successfully",
      description: "Our team will get back to you within 2 hours.",
    });
    
    setIssueDescription("");
    setShowIssueDialog(false);
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-zepmeds-purple mr-2" />
          <h3 className="text-white font-medium">Frequently Asked Questions</h3>
        </div>
        
        <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-gray-800">
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Please describe your issue in detail, and our support team will assist you as soon as possible.
              </p>
              <Textarea 
                placeholder="Describe your issue here..."
                className="bg-black/20 border-white/10 min-h-[120px]"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  className="bg-zepmeds-purple hover:bg-zepmeds-purple/90"
                  onClick={handleSubmitIssue}
                >
                  <MessagesSquare className="h-4 w-4 mr-1" />
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Accordion type="single" collapsible className="glass-morphism rounded-lg overflow-hidden">
        <AccordionItem value="item-1" className="border-b border-white/10">
          <AccordionTrigger className="px-4 py-3 hover:bg-white/5 text-sm">
            How can I cancel my order?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 text-gray-400 text-sm">
            <p>You can cancel your order within 30 minutes of placing it if it hasn't been dispatched yet:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Go to Orders in your profile</li>
              <li>Select the order you want to cancel</li>
              <li>Click on "Cancel Order" button</li>
              <li>Select a reason for cancellation</li>
              <li>Confirm your cancellation</li>
            </ul>
            <p className="mt-2">If your order is already dispatched, you cannot cancel it online. Please reach out to our customer service.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border-b border-white/10">
          <AccordionTrigger className="px-4 py-3 hover:bg-white/5 text-sm">
            When will I receive my refund after cancellation?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 text-gray-400 text-sm">
            <p>Refund timelines depend on your payment method:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Credit/Debit Cards: 5-7 business days</li>
              <li>UPI/Net Banking: 2-3 business days</li>
              <li>Wallet: Instant to 24 hours</li>
              <li>BNPL: Will be adjusted in your next bill</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border-b border-white/10">
          <AccordionTrigger className="px-4 py-3 hover:bg-white/5 text-sm">
            How do I track my delivery in real-time?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 text-gray-400 text-sm">
            <p>Real-time tracking is available once your order is out for delivery:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Go to "Track Order" in your active order</li>
              <li>You'll see the live location of your delivery partner</li>
              <li>You can also directly call the delivery partner</li>
              <li>Estimated time of arrival is continuously updated</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border-white/10">
          <AccordionTrigger className="px-4 py-3 hover:bg-white/5 text-sm">
            What if I receive damaged or incorrect items?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 text-gray-400 text-sm">
            <p>If you receive damaged or incorrect items:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Take photos of the received items</li>
              <li>Click on "Report Issue" in the order details</li>
              <li>Select the specific items with issues</li>
              <li>Upload the photos and describe the problem</li>
              <li>Our team will contact you within 2 hours</li>
            </ul>
            <p className="mt-2">You may be eligible for a refund or replacement depending on the situation.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OrderFAQ;
