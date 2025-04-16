import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      subscribeToProfileChanges(user.id);
      subscribeToEmergencyRequestChanges(user.id);
    }

    // Cleanup function (optional)
    return () => {
      // Any cleanup logic here
    };
  }, [user?.id]);

  const subscribeToProfileChanges = async (userId: string) => {
    // Initial fetch of profile data
    try {
      // Replace the problematic queries with the correct table names
      const { data: profileData, error: profileError } = await supabase
        .from('customers')  // Changed from 'profiles'
        .select('*')
        .eq('id', userId)
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
    supabase
      .channel('public:customers') // Changed from 'public:profiles'
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${userId}` }, // Changed from 'profiles'
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

  const subscribeToEmergencyRequestChanges = async (userId: string) => {
    // Initial fetch of emergency request data
    try {
      // Update emergency-related queries to use the correct tables
      const { data: emergencyData, error: emergencyError } = await supabase
        .from('orders')  // Changed from 'emergency_requests'
        .select('*')
        .eq('id', userId)
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
    supabase
      .channel('public:orders') // Changed from 'public:emergency_requests'
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` }, // Changed from 'emergency_requests'
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
