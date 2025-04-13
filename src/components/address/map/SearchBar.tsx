
import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchResult } from "./useAddressSearch";

interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  handleSearch: (query: string) => void;
  handleSearchResultClick: (result: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  setSearchValue,
  searchResults,
  isSearching,
  handleSearch,
  handleSearchResultClick
}) => {
  return (
    <div className="relative flex flex-col w-full">
      <div className="flex w-full items-center relative">
        <Input
          placeholder="Search for a location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchValue)}
          className="pr-10 bg-black/20 border-gray-700"
        />
        <div 
          className="absolute right-3 flex items-center justify-center"
          onClick={() => handleSearch(searchValue)}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400 cursor-pointer" />
          )}
        </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-black border border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="px-3 py-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => handleSearchResultClick(result)}
            >
              <p className="text-sm text-white">{result.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
