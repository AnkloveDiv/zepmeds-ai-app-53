
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.phoneNumber) {
      subscribeToProfileChanges(user.phoneNumber);
      subscribeToEmergencyRequestChanges(user.phoneNumber);
    }

    // Cleanup function (optional)
    return () => {
      // Any cleanup logic here
    };
  }, [user?.phoneNumber]);

  const subscribeToProfileChanges = async (phoneNumber: string) => {
    // Initial fetch of profile data
    try {
      // Replace the problematic queries with the correct table names
      const { data: profileData, error: profileError } = await supabase
        .from('customers')  // Changed from 'profiles'
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (profileError) {
        console.error('Error fetching initial profile data:', profileError);
        toast({
          title: 'Error fetching profile',
          description: 'Failed to retrieve your profile data.',
          variant: 'destructive',
        });
      } else {
        console.log('Initial profile data:', profileData);
        // Handle initial profile data here
      }
    } catch (error) {
      console.error('Unexpected error fetching initial profile:', error);
      toast({
        title: 'Unexpected error',
        description: 'An unexpected error occurred while fetching your profile.',
        variant: 'destructive',
      });
    }

    // Realtime subscription to profile changes
    const channel = supabase.channel('public:customers')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'customers',
          filter: `phone=eq.${phoneNumber}` 
        },
        (payload) => {
          console.log('Profile change received!', payload);
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated.',
          });
        }
      )
      .subscribe();
  };

  const subscribeToEmergencyRequestChanges = async (phoneNumber: string) => {
    // Initial fetch of emergency request data
    try {
      // Update emergency-related queries to use the correct tables
      const { data: emergencyData, error: emergencyError } = await supabase
        .from('orders_new')  // Using orders_new table
        .select('*')
        .eq('customer', phoneNumber)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (emergencyError) {
        console.error('Error fetching initial emergency request:', emergencyError);
        toast({
          title: 'Error fetching request',
          description: 'Failed to retrieve your emergency request.',
          variant: 'destructive',
        });
      } else {
        console.log('Initial emergency request:', emergencyData);
        // Handle initial emergency request data here
      }
    } catch (error) {
      console.error('Unexpected error fetching initial request:', error);
      toast({
        title: 'Unexpected error',
        description: 'An unexpected error occurred while fetching your request.',
        variant: 'destructive',
      });
    }

    // Realtime subscription to emergency request changes
    const channel = supabase.channel('public:orders_new')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders_new',
          filter: `customer=eq.${phoneNumber}` 
        },
        (payload) => {
          console.log('Emergency request change received!', payload);
          toast({
            title: 'Emergency request updated',
            description: 'Your emergency request has been updated.',
          });
        }
      )
      .subscribe();
  };
};

// Export a function to initialize dashboard sync
export const initializeDashboardSync = () => {
  console.log('Initializing dashboard synchronization...');
  // This function doesn't need to do anything yet,
  // it's just a placeholder to satisfy the import in main.tsx
  return true;
};
