
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay,
  DialogTitle,
  DialogDescription
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
        <DialogContent className="p-0 max-w-md w-[95vw] mx-auto h-[80vh] sm:h-[600px] flex flex-col bg-background/90 backdrop-blur border-white/10 border overflow-hidden">
          <DialogTitle className="sr-only">Order Support Chat</DialogTitle>
          <DialogDescription className="sr-only">Chat with a support agent about your order</DialogDescription>
          <SupportChatbot orderId={orderId} onClose={onClose} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ChatbotModal;
