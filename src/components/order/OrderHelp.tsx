
import { useState } from "react";
import OrderActions from "@/components/order/OrderActions";
import OrderFAQ from "@/components/order/OrderFAQ";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OrderHelpProps {
  orderId: string;
}

const OrderHelp = ({ orderId }: OrderHelpProps) => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  
  const handleToggleFAQ = () => {
    setShowFAQ(!showFAQ);
    if (showChat) setShowChat(false);
  };
  
  const handleToggleChat = () => {
    setShowChat(!showChat);
    if (showFAQ) setShowFAQ(false);
  };
  
  const handleSendMessage = () => {
    toast({
      title: "Message sent",
      description: "Our team will respond to your query soon.",
    });
  };
  
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-white font-bold mb-4">Need Help?</h3>
      
      <div className="mb-4 space-y-2">
        <Button 
          variant="outline" 
          onClick={handleToggleFAQ}
          className="w-full justify-between text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
        >
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            <span>Frequently Asked Questions</span>
          </div>
          {showFAQ ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleToggleChat}
          className="w-full justify-between text-green-400 border-green-500/30 hover:bg-green-500/10"
        >
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <span>Chat with Agent</span>
          </div>
          {showChat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {showFAQ && <OrderFAQ />}
      
      {showChat && (
        <div className="glass-morphism rounded-lg p-3 mb-4">
          <div className="bg-black/40 rounded-lg p-3 mb-3 text-gray-300">
            How can I help you with your order #{orderId}?
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-zepmeds-purple"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
            >
              Send
            </Button>
          </div>
        </div>
      )}
      
      <OrderActions orderId={orderId} />
    </div>
  );
};

export default OrderHelp;
