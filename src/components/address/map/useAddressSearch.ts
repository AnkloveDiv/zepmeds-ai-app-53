
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  searchAddressWithGoogle, 
  getAddressFromCoordinates 
} from "@/utils/googleMapsLoader";
import { AddressDetails } from "./AddressInfoDisplay";

export function useAddressSearch() {
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(null);
  const { toast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoadingAddress(true);
    console.log("Searching for address:", searchQuery);
    
    try {
      const searchResult = await searchAddressWithGoogle(searchQuery);
      const { lat, lng, address } = searchResult;
      
      handleGeocodeResult(address, lat, lng);
      return { lat, lng };
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Could not find the location. Please try a different search term.",
        variant: "destructive",
      });
      setLoadingAddress(false);
      return null;
    }
  };

  const handleCoordinateChange = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const result = await getAddressFromCoordinates(lat, lng);
      handleGeocodeResult(result, lat, lng);
    } catch (error) {
      console.error("Error getting address:", error);
      setLoadingAddress(false);
      toast({
        title: "Address lookup failed",
        description: "Could not retrieve address details for this location.",
        variant: "destructive",
      });
    }
  };

  const handleGeocodeResult = (result: any, lat: number, lng: number) => {
    console.log("Processing geocode result:", result);
    
    let city = "Unknown City";
    let state = "Unknown State";
    let zipCode = "000000";
    
    if (result.address_components) {
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }
    }
    
    const addressDetails: AddressDetails = {
      fullAddress: result.formatted_address || `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      latitude: lat,
      longitude: lng,
      city,
      state,
      zipCode
    };
    
    console.log("Address details:", addressDetails);
    setSelectedAddress(addressDetails);
    setLoadingAddress(false);
  };

  return {
    loadingAddress,
    setLoadingAddress,
    selectedAddress,
    setSelectedAddress,
    handleSearch,
    handleCoordinateChange,
    handleGeocodeResult
  };
}
