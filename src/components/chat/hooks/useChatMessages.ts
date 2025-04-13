
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  generateChatResponse, 
  ChatMessage, 
  initializeOrderChat 
} from "@/services/chatbotService";

export const useChatMessages = (orderId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [conversationLength, setConversationLength] = useState(0);
  const { toast } = useToast();

  // Initialize chat on component mount
  useEffect(() => {
    const initialMessages = initializeOrderChat(orderId);
    setMessages(initialMessages);
    
    // Add welcome message from assistant
    setTimeout(() => {
      handleAddMessage({
        role: "assistant",
        content: `Hi there! I'm your ZepMeds support assistant. How can I help with your order #${orderId} today?`,
        timestamp: new Date()
      });
      setInitialLoad(false);
    }, 500);
  }, [orderId]);

  // Check conversation length to update conversationLength state
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === "user").length;
    setConversationLength(userMessages);
  }, [messages]);

  const handleAddMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: content,
      timestamp: new Date()
    };
    handleAddMessage(userMessage);
    
    // Show loading state
    setIsLoading(true);

    try {
      // Get all messages for context
      const allMessages = [...messages, userMessage];
      
      // Generate response
      const response = await generateChatResponse(allMessages, orderId);
      
      // Add assistant message
      handleAddMessage({
        role: "assistant",
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate response. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    initialLoad,
    conversationLength,
    handleSendMessage,
    handleAddMessage
  };
};
