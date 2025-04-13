
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const searchPrompts = ["medicines", "products", "devices", "much more"];

interface AnimatedSearchInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onSearch?: (query: string) => void;
}

const AnimatedSearchInput = ({
  onFocus,
  onBlur,
  onSearch
}: AnimatedSearchInputProps) => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing interval when component mounts or updates
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    // Set up a new interval
    intervalRef.current = window.setInterval(() => {
      setActivePromptIndex((prevIndex) => (prevIndex + 1) % searchPrompts.length);
    }, 2000);
    
    // Clean up the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleInputFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center w-full h-12 px-4 rounded-full bg-black/20 border border-white/10">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        {searchValue ? (
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white flex-1"
            placeholder="Search..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        ) : (
          <div className="flex items-center w-full">
            <span className="text-gray-400 whitespace-nowrap">Search for </span>
            <div className="h-6 ml-1 overflow-hidden relative w-32">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={searchPrompts[activePromptIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-white inline-block absolute left-0"
                >
                  {searchPrompts[activePromptIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <input
              type="text"
              className="absolute inset-0 opacity-0 cursor-text"
              onFocus={(e) => {
                e.target.classList.remove('opacity-0');
                setSearchValue('');
                if (onFocus) onFocus();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedSearchInput;
