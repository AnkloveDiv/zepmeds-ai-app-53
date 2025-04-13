
import React, { useRef, useEffect } from "react";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/services/chatbotService";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  askForFeedback: boolean;
  showRating: boolean;
  conversationLength: number;
  lastAssistantMessage: ChatMessage | undefined;
  handleFeedback: (isPositive: boolean) => void;
  handleRating: (rating: number) => void;
}

const ChatMessages = ({
  messages,
  isLoading,
  askForFeedback,
  showRating,
  conversationLength,
  lastAssistantMessage,
  handleFeedback,
  handleRating
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black/30 to-black/10">
      {messages.filter(m => m.role !== "system").map((message, index) => (
        <AnimatePresence key={index} mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[80%] sm:max-w-[70%] break-words rounded-lg p-3 ${
                message.role === "user" 
                  ? "bg-zepmeds-purple/30 text-white" 
                  : "bg-black/40 text-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.timestamp && (
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-black/40 rounded-lg p-3 flex items-center space-x-2">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            <span className="text-gray-400 text-sm">Typing...</span>
          </div>
        </div>
      )}
      
      {/* Feedback for last assistant message */}
      {askForFeedback && lastAssistantMessage && !showRating && !isLoading && conversationLength >= 3 && (
        <div className="flex justify-start">
          <div className="bg-black/20 rounded-lg p-2 flex items-center space-x-2">
            <span className="text-gray-400 text-xs">Was this helpful?</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-green-500/20"
              onClick={() => handleFeedback(true)}
            >
              <ThumbsUp className="h-4 w-4 text-green-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20"
              onClick={() => handleFeedback(false)}
            >
              <ThumbsDown className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
