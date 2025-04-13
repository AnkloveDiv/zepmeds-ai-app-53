
import { useState, useEffect } from "react";
import { mockMedicines, Medicine } from "./mockMedicineData";

export const useSearchResults = (searchQuery: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsTyping(true);
      const timer = setTimeout(() => {
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

  return {
    isTyping,
    searchResults,
    noResultsFound
  };
};
