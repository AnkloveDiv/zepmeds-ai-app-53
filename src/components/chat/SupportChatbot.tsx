
import React, { useRef } from "react";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatFeedback } from "./hooks/useChatFeedback";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import SuggestedQuestions from "./components/SuggestedQuestions";
import ChatRating from "./components/ChatRating";

interface SupportChatbotProps {
  orderId: string;
  onClose: () => void;
}

const SupportChatbot = ({ orderId, onClose }: SupportChatbotProps) => {
  // Chat message management
  const {
    messages,
    isLoading,
    initialLoad,
    conversationLength,
    handleSendMessage
  } = useChatMessages(orderId);

  // Feedback functionality
  const {
    showRating,
    setShowRating,
    askForFeedback,
    lastAssistantMessage,
    handleRating,
    handleFeedback
  } = useChatFeedback(messages, conversationLength);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader orderId={orderId} onClose={onClose} />
      
      {/* Messages */}
      <ChatMessages 
        messages={messages}
        isLoading={isLoading}
        askForFeedback={askForFeedback}
        showRating={showRating}
        conversationLength={conversationLength}
        lastAssistantMessage={lastAssistantMessage}
        handleFeedback={handleFeedback}
        handleRating={handleRating}
      />

      {/* Suggested Questions */}
      <SuggestedQuestions 
        initialLoad={initialLoad}
        conversationLength={conversationLength}
        onSelectQuestion={handleSendMessage}
      />

      {/* Rating UI */}
      <ChatRating showRating={showRating} onRating={handleRating} />

      {/* Input Area */}
      <ChatInput isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default SupportChatbot;
