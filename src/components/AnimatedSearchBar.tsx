
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const searchTerms = [
  "medicines",
  "products", 
  "devices",
  "much more"
];

const AnimatedSearchBar = ({ placeholder = "Search for" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTerm, setCurrentTerm] = useState(0);
  const [recentSearches] = useState([
    "Paracetamol",
    "Vitamin C",
    "Face Mask",
    "Sanitizer"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTerm((prev) => (prev + 1) % searchTerms.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center rounded-xl px-4 py-3 bg-black/20 border ${
          isFocused ? "border-zepmeds-purple" : "border-white/10"
        } transition-all duration-200`}
      >
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <div className="flex">
          <span className="text-white">{placeholder} </span>
          <div className="w-28 ml-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTerm}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-zepmeds-purple"
              >
                {searchTerms[currentTerm]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <input
          type="text"
          className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-400 ml-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden glass-morphism z-10"
          >
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Searches</h4>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center cursor-pointer"
                  onClick={() => setSearchQuery(search)}
                >
                  <Search className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-white">{search}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedSearchBar;
