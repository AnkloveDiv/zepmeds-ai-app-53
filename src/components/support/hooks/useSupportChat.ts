
import { useState, useEffect } from "react";

interface ChatMessage {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface AgentInfo {
  name: string; 
  image: string;
}

export const useSupportChat = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {message: "Welcome to ZepMeds Support. How can we help you today?", isUser: false, timestamp: new Date()}
  ]);

  const supportAgents = [
    { name: "Priya Sharma", image: "https://source.unsplash.com/random/100x100/?woman,professional,indian" },
    { name: "Rajiv Mehta", image: "https://source.unsplash.com/random/100x100/?man,professional,indian" },
    { name: "Ananya Patel", image: "https://source.unsplash.com/random/100x100/?woman,customer,service" }
  ];

  useEffect(() => {
    if (!agentConnected && !isConnecting) {
      setIsConnecting(true);
      setChatHistory(prev => [...prev, {
        message: "Connecting you to a support agent... Please wait.",
        isUser: false,
        timestamp: new Date()
      }]);
      
      const timer = setTimeout(() => {
        const randomAgent = supportAgents[Math.floor(Math.random() * supportAgents.length)];
        setAgentInfo(randomAgent);
        
        setChatHistory(prev => [...prev, {
          message: `Agent ${randomAgent.name} has joined the chat.`,
          isUser: false,
          timestamp: new Date()
        }]);
        
        setTimeout(() => {
          setAgentTyping(true);
          
          setTimeout(() => {
            setAgentTyping(false);
            setChatHistory(prev => [...prev, {
              message: `Hi there! I'm ${randomAgent.name}, a real person from ZepMeds support team. How can I assist you today with your medicines or delivery?`,
              isUser: false,
              timestamp: new Date()
            }]);
            setAgentConnected(true);
            setIsConnecting(false);
          }, 2000);
        }, 1000);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [agentConnected, isConnecting]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const now = new Date();
    setChatHistory(prev => [...prev, {message: chatMessage, isUser: true, timestamp: now}]);
    setChatMessage("");
    
    if (agentConnected) {
      setAgentTyping(true);
      
      setTimeout(() => {
        setAgentTyping(false);
        setChatHistory(prev => [...prev, {
          message: "I understand your concern. As a real support agent, I'll personally look into this for you. Could you please provide a few more details so I can help you better?",
          isUser: false,
          timestamp: new Date()
        }]);
      }, 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    chatMessage,
    setChatMessage,
    chatHistory,
    agentInfo,
    isConnecting,
    agentConnected,
    agentTyping,
    handleSendMessage,
    formatTime
  };
};
