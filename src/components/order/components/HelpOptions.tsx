
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface HelpOptionsProps {
  showFAQ: boolean;
  showChat: boolean;
  onToggleFAQ: () => void;
  onToggleChat: () => void;
}

const HelpOptions = ({ 
  showFAQ, 
  showChat, 
  onToggleFAQ, 
  onToggleChat 
}: HelpOptionsProps) => {
  return (
    <div className="mb-4 space-y-2">
      <Button 
        variant="outline" 
        onClick={onToggleFAQ}
        className="w-full justify-between text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          <span>Frequently Asked Questions</span>
        </div>
        {showFAQ ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onToggleChat}
        className="w-full justify-between text-green-400 border-green-500/30 hover:bg-green-500/10"
      >
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <span>Chat with Agent</span>
        </div>
        {showChat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default HelpOptions;
