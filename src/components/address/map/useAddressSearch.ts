
import { useState, useCallback } from 'react';
import { geocodeAddress } from '@/utils/openLayersLoader';
import { Location } from './useMapLocation';
import { toast } from 'sonner';
import { Map } from 'ol';

export interface SearchResult {
  id: string;
  description: string;
  placeId: string;
}

export const useAddressSearch = (
  map: Map | null,
  setLocation: (location: Location) => void
) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const result = await geocodeAddress(query);
      if (result) {
        const formattedResults: SearchResult[] = [{
          id: result.place_id || 'geocode-result',
          description: result.formatted_address || query,
          placeId: result.place_id || 'geocode-result'
        }];
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Geocoding search error:", error);
      setSearchResults([]);
      toast.error("Search failed. Please try a different query.");
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  const handleSearchResultClick = useCallback(async (result: SearchResult) => {
    if (!map) return;
    
    setSearchValue(result.description);
    setSearchResults([]);
    
    try {
      const geocodeResult = await geocodeAddress(result.description);
      if (geocodeResult && geocodeResult.geometry && geocodeResult.geometry.location) {
        const lat = geocodeResult.geometry.location.lat();
        const lng = geocodeResult.geometry.location.lng();
        
        setLocation({ lat, lng });
      }
    } catch (error) {
      console.error("Error getting location for place:", error);
      toast.error("Couldn't get location details. Please try another address.");
    }
  }, [map, setLocation]);
  
  return {
    searchValue,
    setSearchValue,
    searchResults,
    isSearching,
    handleSearch,
    handleSearchResultClick
  };
};
