
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ placeholder = "Search for medicines, products..." }) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    "Paracetamol",
    "Vitamin C",
    "Face Mask",
    "Sanitizer"
  ]);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
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
    } else {
      setSearchResults([]);
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
      <div
        className={`flex items-center rounded-xl px-4 py-3 bg-black/20 border ${
          isFocused ? "border-zepmeds-purple" : "border-white/10"
        } transition-all duration-200`}
      >
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder={placeholder}
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
              {searchResults.length > 0 ? (
                <>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Search Results</h4>
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center cursor-pointer"
                      onClick={() => handleSearch(result.name)}
                    >
                      <Search className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <span className="text-sm text-white">{result.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{result.category}</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Searches</h4>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-white/5 rounded-lg flex items-center cursor-pointer"
                      onClick={() => handleSearch(search)}
                    >
                      <Search className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-white">{search}</span>
                    </div>
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
