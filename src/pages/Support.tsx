import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronRight, MessageCircle, Phone, HelpCircle, Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentInfo, setAgentInfo] = useState<{name: string, image: string} | null>(null);
  const [chatHistory, setChatHistory] = useState<{message: string, isUser: boolean, timestamp: Date}[]>([
    {message: "Welcome to ZepMeds Support. How can we help you today?", isUser: false, timestamp: new Date()}
  ]);

  const supportAgents = [
    { name: "Priya Sharma", image: "https://source.unsplash.com/random/100x100/?woman,professional,indian" },
    { name: "Rajiv Mehta", image: "https://source.unsplash.com/random/100x100/?man,professional,indian" },
    { name: "Ananya Patel", image: "https://source.unsplash.com/random/100x100/?woman,customer,service" }
  ];

  useEffect(() => {
    if (chatOpen && !agentConnected && !isConnecting) {
      setIsConnecting(true);
      
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
              message: `Hi there! I'm ${randomAgent.name}. How can I assist you today with ZepMeds services?`,
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
  }, [chatOpen, agentConnected, isConnecting]);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by searching for medicines, adding them to cart, and proceeding to checkout. You can also upload a prescription and our pharmacists will help you order the medicines."
    },
    {
      question: "How long does delivery take?",
      answer: "We promise delivery within 30 minutes in selected areas. Delivery time may vary based on your location and the availability of medicines."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you will receive a tracking link via SMS. You can also track your order from the 'Order History' section in your profile."
    },
    {
      question: "Is prescription required for all medicines?",
      answer: "Yes, prescription is required for certain medicines as per government regulations. Our app will indicate if a prescription is needed during checkout."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order before it is dispatched. Once dispatched, you cannot cancel but can refuse delivery or return it upon delivery."
    },
    {
      question: "How do I return a medicine?",
      answer: "You can initiate a return from the 'Order History' section. Returns are subject to our return policy and quality check."
    }
  ];

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
          message: "Thank you for providing those details. Let me look into this for you. Is there anything else you'd like me to help you with today?",
          isUser: false,
          timestamp: new Date()
        }]);
      }, 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Help & Support" showBackButton />
      
      <main className="px-4 py-4">
        {!chatOpen ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">How can we help you?</h2>
              
              <div className="grid gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 glass-morphism rounded-xl flex items-center justify-between"
                  onClick={() => setChatOpen(true)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-3">
                      <MessageCircle className="h-5 w-5 text-zepmeds-purple" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Chat with Support</h3>
                      <p className="text-sm text-gray-400">Response time: ~2 mins</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 glass-morphism rounded-xl flex items-center justify-between"
                  onClick={() => window.location.href = "tel:+911234567890"}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Call Support</h3>
                      <p className="text-sm text-gray-400">24/7 Helpline: 1234-567-890</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 glass-morphism rounded-xl flex items-center justify-between"
                  onClick={() => window.location.href = "mailto:support@zepmeds.com"}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Email Support</h3>
                      <p className="text-sm text-gray-400">support@zepmeds.com</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">FAQs</h2>
              
              <Card className="glass-morphism border-white/10">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-white py-4 px-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 px-4 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 mr-2" 
                onClick={() => {
                  setChatOpen(false);
                  setAgentConnected(false);
                  setAgentInfo(null);
                  setChatHistory([{
                    message: "Welcome to ZepMeds Support. How can we help you today?", 
                    isUser: false, 
                    timestamp: new Date()
                  }]);
                }}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <h2 className="text-xl font-bold text-white">Chat with Support</h2>
            </div>
            
            {agentInfo && (
              <div className="glass-morphism rounded-lg p-3 mb-3 flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-zepmeds-purple">
                  <AvatarImage src={agentInfo.image} alt={agentInfo.name} />
                  <AvatarFallback>{agentInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{agentInfo.name}</h3>
                  <p className="text-xs text-gray-400">ZepMeds Support Agent</p>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto mb-4 glass-morphism rounded-lg p-4">
              {isConnecting && !agentConnected && (
                <div className="flex items-center justify-center h-20 text-gray-400">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <p>Connecting you to the next available agent...</p>
                </div>
              )}
              
              {chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${chat.isUser ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block px-4 py-2 rounded-lg max-w-[85%] ${
                      chat.isUser 
                        ? 'bg-zepmeds-purple text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}
                  >
                    {chat.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(chat.timestamp)}
                  </div>
                </div>
              ))}
              
              {agentTyping && (
                <div className="text-left mb-3">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-700 text-white rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center glass-morphism rounded-lg p-2">
              <Input 
                placeholder="Type your message..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="bg-transparent border-0 focus-visible:ring-0 text-white"
              />
              <Button 
                size="icon" 
                className="h-8 w-8 bg-zepmeds-purple hover:bg-zepmeds-purple-light ml-2"
                onClick={handleSendMessage}
                disabled={isConnecting && !agentConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Support;
