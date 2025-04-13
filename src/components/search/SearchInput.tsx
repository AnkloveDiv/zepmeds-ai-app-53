
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTypingAnimation } from "./useTypingAnimation";

interface SearchInputProps {
  searchQuery: string;
  isFocused: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholders: string[];
}

const SearchInput = ({ 
  searchQuery, 
  isFocused, 
  onSearch, 
  onFocus, 
  onBlur, 
  onKeyPress,
  placeholders
}: SearchInputProps) => {
  const { currentPlaceholder } = useTypingAnimation({
    placeholders,
    enabled: !isFocused && !searchQuery
  });

  return (
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
        onFocus={onFocus}
        onBlur={onBlur}
        value={searchQuery}
        onChange={onSearch}
        onKeyPress={onKeyPress}
      />
    </motion.div>
  );
};

export default SearchInput;
