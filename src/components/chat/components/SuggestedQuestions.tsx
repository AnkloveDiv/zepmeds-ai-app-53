
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PREDEFINED_QUESTIONS } from "@/services/chatbotService";

interface SuggestedQuestionsProps {
  initialLoad: boolean;
  conversationLength: number;
  onSelectQuestion: (question: string) => void;
}

const SuggestedQuestions = ({ initialLoad, conversationLength, onSelectQuestion }: SuggestedQuestionsProps) => {
  if (initialLoad || conversationLength >= 1) {
    return null;
  }

  return (
    <div className="p-3 bg-black/20">
      <p className="text-gray-400 text-xs mb-2">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_QUESTIONS.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs border-white/10 text-gray-300 hover:bg-white/10"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
