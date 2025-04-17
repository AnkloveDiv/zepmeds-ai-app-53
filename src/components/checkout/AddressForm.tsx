
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address, saveUserAddress } from '@/services/addressService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AddressFormProps {
  onAddressAdded: (address: Address) => void;
  onCancel: () => void;
}

const AddressForm = ({ onAddressAdded, onCancel }: AddressFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !state || !zipcode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Check if user is logged in
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save an address",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectAfterLogin: window.location.pathname } });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current session to retrieve user ID
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      const newAddress = await saveUserAddress({
        address,
        city,
        state,
        zipcode,
        is_default: isDefault
      });
      
      toast({
        title: "Address Saved",
        description: "Your address has been saved successfully.",
      });
      
      onAddressAdded(newAddress);
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address" className="text-sm text-gray-400">Address Line</Label>
        <Input 
          id="address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="123 Main Street, Apartment 4B"
          className="bg-black/40 border-gray-700 text-white mt-1"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="city" className="text-sm text-gray-400">City</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="New York"
            className="bg-black/40 border-gray-700 text-white mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="state" className="text-sm text-gray-400">State</Label>
          <Input 
            id="state" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="NY"
            className="bg-black/40 border-gray-700 text-white mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="zipcode" className="text-sm text-gray-400">Zipcode</Label>
        <Input 
          id="zipcode" 
          value={zipcode} 
          onChange={(e) => setZipcode(e.target.value)} 
          placeholder="10001"
          className="bg-black/40 border-gray-700 text-white mt-1"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="isDefault" 
          checked={isDefault} 
          onCheckedChange={(checked) => setIsDefault(checked === true)} 
        />
        <Label htmlFor="isDefault" className="text-sm text-gray-400">
          Set as default address
        </Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-700 text-gray-300"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-zepmeds-purple hover:bg-zepmeds-purple/90"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
