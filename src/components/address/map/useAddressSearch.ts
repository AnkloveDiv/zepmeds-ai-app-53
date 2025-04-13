
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
  const [placesAPIAvailable, setPlacesAPIAvailable] = useState(false);
  
  // Initialize autocomplete service
  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsAPI();
        
        // Check if Google Maps Places API is available
        if (window.google && window.google.maps && window.google.maps.places) {
          try {
            const service = new window.google.maps.places.AutocompleteService();
            setAutocompleteService(service);
            setPlacesAPIAvailable(true);
          } catch (error) {
            console.error("Error creating AutocompleteService:", error);
            setPlacesAPIAvailable(false);
          }
        } else {
          console.error("Google Maps Places API not available");
          setPlacesAPIAvailable(false);
        }
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
        setPlacesAPIAvailable(false);
      }
    };
    
    initAutocomplete();
  }, []);
  
  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // If Places API is not available, fall back to Geocoding API
    if (!autocompleteService || !placesAPIAvailable) {
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
      return;
    }
    
    // Use Places API if available
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
      
      // Try fallback to geocoding API
      try {
        const result = await geocodeAddress(query);
        if (result) {
          const formattedResults: SearchResult[] = [{
            id: result.place_id || 'geocode-result',
            description: result.formatted_address || query,
            placeId: result.place_id || 'geocode-result'
          }];
          setSearchResults(formattedResults);
        }
      } catch (secondError) {
        console.error("Fallback geocoding failed:", secondError);
      }
    } finally {
      setIsSearching(false);
    }
  }, [autocompleteService, placesAPIAvailable]);
  
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
    handleSearchResultClick,
    placesAPIAvailable
  };
};
