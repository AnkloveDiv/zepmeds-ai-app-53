
import { useState, useCallback, useEffect } from 'react';
import { loadGoogleMapsAPI, geocodeAddress } from '@/utils/googleMapsLoader';
import { Location } from './useMapLocation';
import { toast } from 'sonner';

export interface SearchResult {
  id: string;
  description: string;
  placeId: string;
}

export const useAddressSearch = (
  map: google.maps.Map | null,
  marker: google.maps.Marker | null,
  setLocation: (location: Location) => void
) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  
  // Initialize autocomplete service
  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsAPI();
        setAutocompleteService(new google.maps.places.AutocompleteService());
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    };
    
    initAutocomplete();
  }, []);
  
  const handleSearch = useCallback(async (query: string) => {
    if (!query || !autocompleteService) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: 'in' }, // Limit to India
            types: ['geocode', 'establishment']
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error(`Autocomplete failed: ${status}`));
            }
          }
        );
      });
      
      const formattedResults: SearchResult[] = response.map((result) => ({
        id: result.place_id,
        description: result.description,
        placeId: result.place_id
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [autocompleteService]);
  
  const handleSearchResultClick = useCallback(async (result: SearchResult) => {
    if (!map || !marker) return;
    
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
  }, [map, marker, setLocation]);
  
  return {
    searchValue,
    setSearchValue,
    searchResults,
    isSearching,
    handleSearch,
    handleSearchResultClick
  };
};
