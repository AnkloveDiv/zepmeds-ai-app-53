
import { supabase } from '@/integrations/supabase/client';

export interface Address {
  id: string;
  user_id: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getUserAddresses = async (): Promise<Address[]> => {
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    console.error('No authenticated user found');
    return [];
  }

  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return addresses || [];
};

export const saveUserAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  
  console.log("Data being sent to Supabase:", {
    ...address,
    user_id: session.user.id
  });
  
  // If this is the first address or is_default is true, make sure all other addresses are not default
  if (address.is_default) {
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', session.user.id);
    } catch (error) {
      console.error('Error updating existing addresses:', error);
      // Continue with the insert even if this fails
    }
  }

  // Make sure all string fields are properly trimmed
  const sanitizedAddress = {
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    zipcode: address.zipcode.trim(),
    is_default: address.is_default
  };

  const { data, error } = await supabase
    .from('addresses')
    .insert([{  
      ...sanitizedAddress,
      user_id: session.user.id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving address:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from address insert');
  }

  return data;
};

export const updateUserAddress = async (addressId: string, address: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Address> => {
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  
  // If setting this address as default, update other addresses
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', session.user.id)
      .not('id', 'eq', addressId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', addressId)
    .eq('user_id', session.user.id) // Ensure user can only update their own addresses
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }

  return data;
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', session.user.id); // Ensure user can only delete their own addresses

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
