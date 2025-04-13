
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Simple representation of a chat message
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const OpenSourceChat: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Guest_' + Math.floor(Math.random() * 1000));
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulated support agent messages
  const supportResponses = [
    "Hello! How can I help you today?",
    "I understand your concern. Let me check that for you.",
    "Thank you for your patience. We're working on resolving this issue.",
    "Is there anything else you'd like to know about our services?",
    "We'll get back to you with more information soon.",
    "Your issue has been escalated to our specialized team.",
  ];
  
  // Demo welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: "Welcome to our support chat! This is a demo of an open source chat. In a real implementation, this would connect to a backend service where support agents can respond.",
        sender: 'support',
        timestamp: new Date()
      }
    ]);
    setIsConnected(true);
    
    toast({
      title: "Chat Connected",
      description: "You're now connected to the support chat system."
    });
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate response from support (in a real app, this would come from the server)
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: `support_${Date.now()}`,
        text: supportResponses[Math.floor(Math.random() * supportResponses.length)],
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, supportMessage]);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-gray-900 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 text-zepmeds-purple mr-2" />
          <h3 className="font-medium text-white">Live Support Chat</h3>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-zepmeds-purple text-white' 
                  : 'bg-gray-800 text-white'
              }`}
            >
              <div className="flex items-center mb-1">
                {message.sender === 'support' ? (
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-xs mr-2">
                    S
                  </div>
                ) : (
                  <User className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs font-medium">
                  {message.sender === 'user' ? username : 'Support Agent'}
                </span>
                <Clock className="h-3 w-3 ml-2 opacity-70" />
                <span className="text-xs ml-1 opacity-70">{formatTime(message.timestamp)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-gray-800 bg-gray-900/70">
        <div className="flex items-center">
          <textarea
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-white p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-zepmeds-purple"
            placeholder="Type your message..."
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            className="ml-2 h-10 w-10 p-0 rounded-full bg-zepmeds-purple hover:bg-zepmeds-purple/80 flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>Logged in as: {username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceChat;
