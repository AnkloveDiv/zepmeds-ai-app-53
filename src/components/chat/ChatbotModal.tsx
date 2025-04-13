
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay 
} from "@/components/ui/dialog";
import SupportChatbot from "./SupportChatbot";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const ChatbotModal = ({ isOpen, onClose, orderId }: ChatbotModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
        <DialogContent className="p-0 max-w-md mx-auto h-[80vh] sm:h-[600px] bg-background/90 backdrop-blur border-white/10 border">
          <SupportChatbot orderId={orderId} onClose={onClose} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ChatbotModal;
