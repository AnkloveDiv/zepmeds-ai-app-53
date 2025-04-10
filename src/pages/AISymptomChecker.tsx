
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Pill, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Recommendation {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const AISymptomChecker = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm your health assistant. Please describe your symptoms, and I'll suggest potential causes and recommend suitable medicines.",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // This would be replaced with actual AI backend integration
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Generate medicine recommendations based on symptoms
      const newRecommendations = generateRecommendations(input);
      setRecommendations(newRecommendations);
      
      setLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // In a real app, this would be an API call to a backend AI service
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("headache") || lowerInput.includes("head pain")) {
      return "Based on your description, you may be experiencing a tension headache. This is common and often caused by stress, dehydration, or eye strain. I recommend rest, proper hydration, and the medicines listed below. If your headache is severe or persistent, please consult a doctor.";
    } else if (lowerInput.includes("fever") || lowerInput.includes("temperature")) {
      return "You appear to be experiencing a fever, which is often a sign that your body is fighting an infection. I recommend rest, staying hydrated, and the medications listed below to help manage your symptoms. If your fever is high (above 102°F/39°C) or lasts more than 3 days, please consult a doctor.";
    } else if (lowerInput.includes("cough") || lowerInput.includes("cold")) {
      return "Your symptoms suggest an upper respiratory tract infection like the common cold. These are usually viral infections that resolve on their own. I recommend rest, staying hydrated, and the medications listed below to help manage your symptoms. If you have difficulty breathing or symptoms worsen, please consult a doctor.";
    } else {
      return "Thank you for sharing your symptoms. Without more specific information, I can offer some general recommendations for comfort. Please consider consulting with a healthcare professional for a proper diagnosis. Meanwhile, you might find the following medicines helpful.";
    }
  };

  const generateRecommendations = (userInput: string): Recommendation[] => {
    // In a real app, this would use AI to generate personalized recommendations
    const lowerInput = userInput.toLowerCase();
    const placeholderImg = "/placeholder.svg";
    
    if (lowerInput.includes("headache") || lowerInput.includes("head pain")) {
      return [
        {
          id: "med1",
          name: "Paracetamol Tablets",
          description: "Relieves pain and reduces fever",
          price: 25,
          image: placeholderImg
        },
        {
          id: "med2",
          name: "Ibuprofen Tablets",
          description: "Anti-inflammatory pain reliever",
          price: 35,
          image: placeholderImg
        },
        {
          id: "med3",
          name: "Aspirin Tablets",
          description: "Pain reliever and blood thinner",
          price: 20,
          image: placeholderImg
        }
      ];
    } else if (lowerInput.includes("fever") || lowerInput.includes("temperature")) {
      return [
        {
          id: "med4",
          name: "Paracetamol Tablets",
          description: "Reduces fever and relieves pain",
          price: 25,
          image: placeholderImg
        },
        {
          id: "med5",
          name: "Fever Patch",
          description: "Cooling gel patch for forehead",
          price: 120,
          image: placeholderImg
        },
        {
          id: "med6",
          name: "Electrolyte Solution",
          description: "Replenishes essential minerals",
          price: 40,
          image: placeholderImg
        }
      ];
    } else if (lowerInput.includes("cough") || lowerInput.includes("cold")) {
      return [
        {
          id: "med7",
          name: "Cough Syrup",
          description: "Soothes throat and suppresses cough",
          price: 65,
          image: placeholderImg
        },
        {
          id: "med8",
          name: "Cold & Flu Tablets",
          description: "Relieves multiple cold symptoms",
          price: 45,
          image: placeholderImg
        },
        {
          id: "med9",
          name: "Nasal Decongestant",
          description: "Clears nasal passages",
          price: 30,
          image: placeholderImg
        }
      ];
    } else {
      return [
        {
          id: "med10",
          name: "Multivitamin Tablets",
          description: "Supports overall health",
          price: 120,
          image: placeholderImg
        },
        {
          id: "med11",
          name: "Immune Support Supplement",
          description: "Boosts immune system",
          price: 150,
          image: placeholderImg
        },
        {
          id: "med12",
          name: "Paracetamol Tablets",
          description: "General pain reliever",
          price: 25,
          image: placeholderImg
        }
      ];
    }
  };

  const addToCart = (recommendation: Recommendation) => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === recommendation.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        ...recommendation,
        quantity: 1,
        stripQuantity: 1
      });
    }
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    toast({
      title: "Added to cart",
      description: `${recommendation.name} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="AI Symptom Checker" />
      
      <main className="px-4 py-4">
        <div className="mb-4">
          <div className="glass-morphism rounded-xl p-4">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 text-zepmeds-purple mr-2" />
              <h3 className="text-white font-medium">Health Assistant</h3>
            </div>
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-zepmeds-purple text-white' 
                        : 'bg-black/20 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-black/20 rounded-lg p-3 text-white">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms here..."
                className="bg-black/20 border-white/10 mr-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Recommended Medicines</h3>
            
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-morphism rounded-xl p-3 flex items-center"
                >
                  <div className="h-16 w-16 rounded-lg overflow-hidden mr-3">
                    <img src={rec.image} alt={rec.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{rec.name}</h4>
                    <p className="text-gray-400 text-sm">{rec.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-zepmeds-purple font-bold">₹{rec.price}</span>
                      <Button 
                        size="sm" 
                        className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
                        onClick={() => addToCart(rec)}
                      >
                        <ShoppingCart size={14} className="mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AISymptomChecker;
