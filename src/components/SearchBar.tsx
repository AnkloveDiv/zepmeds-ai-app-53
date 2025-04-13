
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ placeholder = "Search for medicines, products..." }) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Paracetamol",
    "Vitamin C",
    "Face Mask",
    "Sanitizer"
  ]);

  // Typing animation for the placeholder
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "Search for medicines...",
    "Looking for supplements?",
    "Find healthcare products...",
    "Need medical equipment?"
  ];

  useEffect(() => {
    if (!isFocused && !searchQuery) {
      const interval = setInterval(() => {
        const targetPlaceholder = placeholders[placeholderIndex];
        if (currentPlaceholder.length < targetPlaceholder.length) {
          setCurrentPlaceholder(targetPlaceholder.substring(0, currentPlaceholder.length + 1));
        } else {
          clearInterval(interval);
          setTimeout(() => {
            const reverseInterval = setInterval(() => {
              if (currentPlaceholder.length > 0) {
                setCurrentPlaceholder(currentPlaceholder.substring(0, currentPlaceholder.length - 1));
              } else {
                clearInterval(reverseInterval);
                setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentPlaceholder, placeholderIndex, isFocused, searchQuery]);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        // Simplified mock search - in a real app, this would call an API
        const mockMedicines = [
          { id: 1, name: "Paracetamol 500mg", category: "Pain Relief" },
          { id: 2, name: "Vitamin C 1000mg", category: "Vitamins" },
          { id: 3, name: "Aspirin 300mg", category: "Pain Relief" },
          { id: 4, name: "Amoxicillin 500mg", category: "Antibiotics" },
          { id: 5, name: "Pantoprazole 40mg", category: "Digestive Health" },
          { id: 6, name: "Face Mask N95", category: "Medical Supplies" },
          { id: 7, name: "Hand Sanitizer", category: "Hygiene" },
          { id: 8, name: "Blood Pressure Monitor", category: "Medical Devices" }
        ];
        
        const results = mockMedicines.filter(medicine => 
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(results);
        setNoResultsFound(results.length === 0);
        setIsTyping(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setNoResultsFound(false);
    }
  }, [searchQuery]);

  const handleSearch = (term) => {
    // Save to recent searches if not already there
    if (!recentSearches.includes(term) && term.trim() !== "") {
      const updatedSearches = [term, ...recentSearches.slice(0, 3)];
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
    
    // Navigate to medicine page with search query
    navigate(`/medicine-delivery?search=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ scale: 0.98, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center rounded-xl px-4 py-3 bg-black/20 border ${
          isFocused ? "border-zepmeds-purple" : "border-white/10"
        } transition-all duration-200`}
      >
        <motion.div
          animate={{ rotate: isFocused ? [0, 15, -15, 0] : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Search className="h-5 w-5 text-gray-400 mr-2" />
        </motion.div>
        <input
          type="text"
          placeholder={!searchQuery && !isFocused ? currentPlaceholder : "Search for medicines, products..."}
          className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-400"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchQuery.trim() !== "") {
              handleSearch(searchQuery);
            }
          }}
        />
      </motion.div>
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden glass-morphism z-10"
          >
            <div className="p-3">
              {isTyping && (
                <div className="flex justify-center py-4">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
                      className="h-2 w-2 bg-zepmeds-purple rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.1, repeat: Infinity, repeatType: "loop" }}
                      className="h-2 w-2 bg-zepmeds-purple rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, repeatType: "loop" }}
                      className="h-2 w-2 bg-zepmeds-purple rounded-full"
                    />
                  </div>
                </div>
              )}
              
              {noResultsFound && !isTyping && (
                <div className="px-3 py-4 text-center">
                  <p className="text-sm text-white mb-1">Sorry, "{searchQuery}" is out of stock</p>
                  <p className="text-xs text-red-400">Out of stock, we will notify you</p>
                </div>
              )}
              
              {searchResults.length > 0 ? (
                <>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Search Results</h4>
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center cursor-pointer"
                      onClick={() => handleSearch(result.name)}
                    >
                      <Search className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <span className="text-sm text-white">{result.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{result.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : !noResultsFound && !isTyping && (
                <>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Searches</h4>
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center cursor-pointer"
                      onClick={() => handleSearch(search)}
                    >
                      <Search className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-white">{search}</span>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
