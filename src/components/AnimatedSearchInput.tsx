
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const searchPrompts = ["medicines", "products", "devices", "much more"];

const AnimatedSearchInput = () => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prevIndex) => (prevIndex + 1) % searchPrompts.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <div className="flex items-center w-full h-12 px-4 rounded-full bg-black/20 border border-white/10">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <div className="flex items-center">
          <span className="text-gray-400">Search for </span>
          <div className="h-6 ml-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={activePromptIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white inline-block"
              >
                {searchPrompts[activePromptIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearchInput;
