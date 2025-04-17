
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
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated user found');
      return [];
    }

    console.log('Fetching addresses for user:', session.user.id);
    
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
  } catch (error) {
    console.error('Error in getUserAddresses:', error);
    return [];
  }
};

export const saveUserAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  try {
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('User not authenticated when saving address');
      throw new Error('User not authenticated');
    }
    
    // Ensure we're using a fresh auth token
    await supabase.auth.refreshSession();
    
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

    // Explicitly insert with the user_id from the session
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
      console.error('Error details:', error.details, error.hint, error.message);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from address insert');
    }

    console.log('Address saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveUserAddress:', error);
    throw error;
  }
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
