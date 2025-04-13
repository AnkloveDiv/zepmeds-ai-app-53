
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface QuickChatInterfaceProps {
  orderId: string;
  onOpenChat: () => void;
}

const QuickChatInterface = ({ orderId, onOpenChat }: QuickChatInterfaceProps) => {
  return (
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
          onClick={onOpenChat}
          className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Chat
        </Button>
      </div>
    </div>
  );
};

export default QuickChatInterface;
