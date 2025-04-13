
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ChatRatingProps {
  showRating: boolean;
  onRating: (rating: number) => void;
}

const ChatRating = ({ showRating, onRating }: ChatRatingProps) => {
  if (!showRating) {
    return null;
  }

  return (
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
            onClick={() => onRating(rating)}
          >
            <Star className={`h-5 w-5 ${rating <= 3 ? "fill-none" : "fill-amber-400"}`} />
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatRating;
