
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Loader2, Send } from "lucide-react";
import { useSupportChat } from "./hooks/useSupportChat";

interface SupportChatProps {
  onBack: () => void;
}

const SupportChat = ({ onBack }: SupportChatProps) => {
  const {
    chatMessage,
    setChatMessage,
    chatHistory,
    agentInfo,
    isConnecting,
    agentConnected,
    agentTyping,
    handleSendMessage,
    formatTime
  } = useSupportChat();

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 mr-2" 
          onClick={onBack}
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
  );
};

export default SupportChat;
