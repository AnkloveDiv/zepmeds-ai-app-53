
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
  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return addresses || [];
};

export const saveUserAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // If this is the first address or is_default is true, make sure all other addresses are not default
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      ...address,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving address:', error);
    throw error;
  }

  return data;
};

export const updateUserAddress = async (addressId: string, address: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Address> => {
  // If setting this address as default, update other addresses
  if (address.is_default) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .not('id', 'eq', addressId);
    }
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }

  return data;
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
