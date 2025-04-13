
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchResult {
  id: number;
  name: string;
  category: string;
}

interface SearchResultsProps {
  isTyping: boolean;
  noResultsFound: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  handleSearch: (term: string) => void;
}

const SearchResults = ({
  isTyping,
  noResultsFound,
  searchQuery,
  searchResults,
  recentSearches,
  handleSearch
}: SearchResultsProps) => {
  return (
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
  );
};

export default SearchResults;
