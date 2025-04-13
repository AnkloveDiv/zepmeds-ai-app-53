
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ChatHeaderProps {
  orderId: string;
  onClose: () => void;
}

const ChatHeader = ({ orderId, onClose }: ChatHeaderProps) => {
  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between glass-morphism p-3 rounded-t-lg bg-black/60">
        <div className="flex items-center">
          <div className="bg-green-500/20 p-2 rounded-full mr-2">
            <MessageCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Order Support</h3>
            <p className="text-gray-400 text-xs">Order #{orderId}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
      
      <Separator className="bg-white/10" />
    </>
  );
};

export default ChatHeader;
