
import React from "react";
import { useOrderHelp } from "./hooks/useOrderHelp";
import HelpOptions from "./components/HelpOptions";
import QuickChatInterface from "./components/QuickChatInterface";
import OrderFAQ from "./OrderFAQ";
import OrderActions from "./OrderActions";
import ChatbotModal from "../chat/ChatbotModal";

interface OrderHelpProps {
  orderId: string;
}

const OrderHelp = ({ orderId }: OrderHelpProps) => {
  const {
    showFAQ,
    showChat,
    showChatbot,
    handleToggleFAQ,
    handleToggleChat,
    handleOpenChatbot,
    handleCloseChatbot
  } = useOrderHelp(orderId);
  
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-white font-bold mb-4">Need Help?</h3>
      
      <HelpOptions 
        showFAQ={showFAQ}
        showChat={showChat}
        onToggleFAQ={handleToggleFAQ}
        onToggleChat={handleToggleChat}
      />
      
      {showFAQ && <OrderFAQ />}
      
      {showChat && (
        <QuickChatInterface 
          orderId={orderId}
          onOpenChat={handleOpenChatbot}
        />
      )}
      
      <OrderActions 
        orderId={orderId} 
        onOpenChat={handleOpenChatbot}
      />
      
      {/* Chatbot Modal */}
      <ChatbotModal 
        isOpen={showChatbot} 
        onClose={handleCloseChatbot} 
        orderId={orderId} 
      />
    </div>
  );
};

export default OrderHelp;
