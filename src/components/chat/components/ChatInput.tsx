
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ isLoading, onSendMessage }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 p-3 bg-black/40 border-t border-white/10 rounded-b-lg">
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="h-10 bg-black/30 border-white/10 text-white"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="h-10 w-10 flex-shrink-0 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
