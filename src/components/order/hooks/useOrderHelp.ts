
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useOrderHelp = (orderId: string) => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();
  
  const handleToggleFAQ = () => {
    setShowFAQ(!showFAQ);
    if (showChat) setShowChat(false);
  };
  
  const handleToggleChat = () => {
    setShowChat(!showChat);
    if (showFAQ) setShowFAQ(false);
  };
  
  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };
  
  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  return {
    showFAQ,
    showChat,
    showChatbot,
    handleToggleFAQ,
    handleToggleChat,
    handleOpenChatbot,
    handleCloseChatbot,
  };
};
