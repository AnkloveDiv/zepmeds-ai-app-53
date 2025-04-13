
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/services/chatbotService";

export const useChatFeedback = (messages: ChatMessage[], conversationLength: number) => {
  const [showRating, setShowRating] = useState(false);
  const [askForFeedback, setAskForFeedback] = useState(false);
  const { toast } = useToast();

  // Check conversation length to prompt for feedback
  useEffect(() => {
    // After 3-4 user messages, we should ask for feedback if we haven't already
    if (conversationLength >= 3 && !showRating && !askForFeedback) {
      setAskForFeedback(true);
    }
  }, [conversationLength, showRating]);

  const handleRating = (rating: number) => {
    toast({
      title: "Thank you for your feedback!",
      description: `You rated our chat service ${rating}/5 stars.`
    });
    setShowRating(false);
  };

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: "Thank you for your feedback!",
      description: isPositive ? "We're glad you found this helpful!" : "We'll work on improving our responses."
    });
    
    // Remove the feedback UI
    setAskForFeedback(false);
  };

  // Get last assistant message for feedback
  const lastAssistantMessage = [...messages]
    .filter(m => m.role === "assistant")
    .pop();

  return {
    showRating,
    setShowRating,
    askForFeedback,
    lastAssistantMessage,
    handleRating,
    handleFeedback
  };
};
