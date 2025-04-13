
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Star, 
  X,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  generateChatResponse, 
  ChatMessage, 
  PREDEFINED_QUESTIONS,
  initializeOrderChat
} from "@/services/chatbotService";
import { motion, AnimatePresence } from "framer-motion";

interface SupportChatbotProps {
  orderId: string;
  onClose: () => void;
}

const SupportChatbot = ({ orderId, onClose }: SupportChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (content?: string) => {
    const messageText = content || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: messageText,
      timestamp: new Date()
    };
    handleAddMessage(userMessage);
    
    // Clear input if it's from the text field
    if (!content) setInput("");
    
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
      
      // After 3 messages from the user, show rating
      const userMessageCount = allMessages.filter(m => m.role === "user").length;
      if (userMessageCount >= 3 && !showRating) {
        setShowRating(true);
      }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleRating = (rating: number) => {
    toast({
      title: "Thank you for your feedback!",
      description: `You rated our chat service ${rating}/5 stars.`
    });
    setShowRating(false);
    
    // Add a final thank you message
    setTimeout(() => {
      handleAddMessage({
        role: "assistant",
        content: "Thank you for your feedback! Is there anything else I can help you with?",
        timestamp: new Date()
      });
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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

      {/* Messages Container */}
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
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" 
                    ? "bg-zepmeds-purple/30 text-white" 
                    : "bg-black/40 text-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {!initialLoad && messages.filter(m => m.role === "user").length < 1 && (
        <div className="p-3 bg-black/20">
          <p className="text-gray-400 text-xs mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-white/10 text-gray-300 hover:bg-white/10"
                onClick={() => handleSendMessage(question)}
              >
                {question}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Rating UI */}
      {showRating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 bg-black/30 border-t border-white/10"
        >
          <p className="text-gray-300 text-sm mb-2">How would you rate this conversation?</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => handleRating(rating)}
              >
                <Star className={`h-5 w-5 ${rating <= 3 ? "fill-none" : "fill-amber-400"}`} />
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-black/40 border-t border-white/10 rounded-b-lg">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-10 bg-black/30 border-white/10 resize-none text-white"
            maxRows={3}
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-10 w-10 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
