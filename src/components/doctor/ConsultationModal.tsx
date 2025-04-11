
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Video, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  available: boolean;
  bio: string;
}

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onStartConsultation: (type: "video" | "chat" | "audio") => void;
}

const ConsultationModal = ({ 
  open, 
  onOpenChange, 
  doctor, 
  onStartConsultation 
}: ConsultationModalProps) => {
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{sender: string, text: string}>>([]);
  
  if (!doctor) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {sender: 'You', text: message}]);
    setMessage("");
    
    // Simulate doctor response after delay
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        sender: doctor.name, 
        text: `Thank you for your message. I understand your concern. Please provide more details about your symptoms so I can help you better.`
      }]);
    }, 1500);
  };
  
  const handleStartChat = () => {
    setShowChat(true);
    // Add initial message from doctor
    setChatHistory([{
      sender: doctor.name,
      text: `Hello! I'm Dr. ${doctor.name}. How can I help you today?`
    }]);
  };
  
  const handleCallOrVideo = (type: "video" | "audio") => {
    toast({
      title: `Starting ${type} consultation`,
      description: `Connecting you with Dr. ${doctor.name}...`,
    });
    onStartConsultation(type);
    onOpenChange(false);
  };

  if (showChat) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarFallback className="rounded-full bg-zepmeds-purple/20 text-zepmeds-purple">
                  {doctor.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span>Dr. {doctor.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'You' 
                      ? 'bg-zepmeds-purple text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs font-medium mb-1">{msg.sender}</p>
                  <p>{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 border-0 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-zepmeds-purple"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              className="rounded-full bg-zepmeds-purple hover:bg-zepmeds-purple/90 p-2 h-10 w-10"
              onClick={handleSendMessage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Consult with {doctor.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14 rounded-lg">
              <AvatarFallback className="rounded-lg bg-zepmeds-purple/20 text-zepmeds-purple">
                {doctor.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{doctor.name}</h3>
              <p className="text-sm text-gray-400">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs">{doctor.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-black/20 rounded-lg">
            <h4 className="font-medium mb-1">About Doctor</h4>
            <p className="text-sm text-gray-400">{doctor.bio}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Consultation Fee</h4>
            <p className="text-zepmeds-purple font-bold text-xl">₹{doctor.price}</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90 flex justify-center items-center gap-2"
              onClick={() => handleCallOrVideo("video")}
            >
              <Video size={16} />
              <span>Video Call</span>
            </Button>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
              onClick={() => handleCallOrVideo("audio")}
            >
              <Phone size={16} />
              <span>Voice Call</span>
            </Button>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2"
              onClick={handleStartChat}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
