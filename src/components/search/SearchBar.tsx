
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { useSearchResults } from "./useSearchResults";
import { Medicine } from "./mockMedicineData";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar = ({ placeholder = "Search for medicines, products..." }: SearchBarProps) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Paracetamol",
    "Vitamin C",
    "Face Mask",
    "Sanitizer"
  ]);
  
  const placeholders = [
    "Search for medicines...",
    "Looking for supplements?",
    "Find healthcare products...",
    "Need medical equipment?"
  ];

  const { isTyping, searchResults, noResultsFound } = useSearchResults(searchQuery);

  useEffect(() => {
    // Load recent searches from localStorage if available
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSearch = (term: string) => {
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
      <SearchInput 
        searchQuery={searchQuery}
        isFocused={isFocused}
        onSearch={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && searchQuery.trim() !== "") {
            handleSearch(searchQuery);
          }
        }}
        placeholders={placeholders}
      />
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden glass-morphism z-10"
          >
            <SearchResults 
              isTyping={isTyping}
              noResultsFound={noResultsFound}
              searchQuery={searchQuery}
              searchResults={searchResults}
              recentSearches={recentSearches}
              handleSearch={handleSearch}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
