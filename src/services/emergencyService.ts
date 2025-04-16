
/**
 * Emergency Service
 * Handles emergency-related API operations
 */

import { supabase } from '@/integrations/supabase/client';
import { ApiClient } from './apiClient';
import { EmergencyRequestPayload, ApiResponse } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentLocation } from './orders/utils';

// Function to generate a unique order ID
const generateOrderId = () => {
  return `EMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export class EmergencyService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  /**
   * Send emergency request to the admin dashboard
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<ApiResponse> {
    console.log('Sending emergency request to admin dashboard:', payload);
    try {
      // Send to the external API
      return await this.apiClient.post<ApiResponse>('/emergency/request', payload);
    } catch (error) {
      console.error('Failed to send emergency request to admin dashboard:', error);
      throw error;
    }
  }
  
  /**
   * Update emergency status in the admin dashboard
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<ApiResponse> {
    console.log(`Updating emergency status for ${requestId} to ${status}`);
    try {
      // Update in the external API
      return await this.apiClient.post<ApiResponse>('/emergency/update-status', {
        requestId,
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error updating emergency status for ${requestId}:`, error);
      throw error;
    }
  }
  
  /**
   * Cancel emergency request in the admin dashboard
   */
  public async cancelEmergencyRequest(requestId: string): Promise<ApiResponse> {
    console.log(`Cancelling emergency request ${requestId}`);
    try {
      // Cancel in the external API
      return await this.apiClient.post<ApiResponse>('/emergency/cancel', {
        requestId,
        cancelledAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error cancelling emergency request ${requestId}:`, error);
      throw error;
    }
  }
}

// Create a hook for using emergency service
export const useEmergencyService = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ambulance, setAmbulance] = useState<any | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);

  const apiClient = new ApiClient('https://api.zepmeds.com/v1');
  const emergencyService = new EmergencyService(apiClient);

  // Fetch any existing emergency requests for this user
  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      if (!user?.phoneNumber) return;

      try {
        const { data, error } = await supabase
          .from('emergency_requests')
          .select('*')
          .eq('phone', user.phoneNumber)
          .order('timestamp', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching emergency requests:', error);
          return;
        }

        if (data && data.length > 0) {
          setEmergencyRequests(data);
          
          // If there's an active request, update the UI
          const activeRequest = data.find(req => req.status === 'pending' || req.status === 'dispatched');
          if (activeRequest) {
            // Set ambulance info if available
            if (activeRequest.ambulance_id) {
              const { data: ambulanceData } = await supabase
                .from('ambulances')
                .select('*')
                .eq('id', activeRequest.ambulance_id)
                .single();
              
              if (ambulanceData) {
                setAmbulance(ambulanceData);
                
                // Calculate ETA based on ambulance data if available
                if (ambulanceData.last_updated) {
                  const minutesSinceUpdate = Math.floor((Date.now() - new Date(ambulanceData.last_updated).getTime()) / (1000 * 60));
                  setEta(Math.max(5, 15 - minutesSinceUpdate)); // Simple ETA calculation
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error in emergency requests fetch:', err);
      }
    };

    fetchEmergencyRequests();
    
    // Set up realtime subscription for emergency request updates
    const channel = supabase
      .channel('emergency_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_requests',
          filter: user?.phoneNumber ? `phone=eq.${user.phoneNumber}` : undefined
        },
        (payload) => {
          console.log('Emergency request changed:', payload);
          // Refresh the list when there's a change
          fetchEmergencyRequests();
          
          // Show toast notification for updates
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            if (newStatus === 'dispatched') {
              toast({
                title: 'Ambulance Dispatched',
                description: 'An ambulance has been dispatched to your location.',
              });
            } else if (newStatus === 'arrived') {
              toast({
                title: 'Ambulance Arrived',
                description: 'The ambulance has arrived at your location.',
              });
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.phoneNumber, toast]);

  // Request emergency service
  const requestEmergencyService = useCallback(async (emergencyData: EmergencyRequestPayload) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Generate a unique emergency ID
      const emergencyId = generateOrderId();
      
      // Get location data
      const locationData = await getCurrentLocation();
      
      // Create emergency record in Supabase
      const { data, error: supabaseError } = await supabase
        .from('emergency_requests')
        .insert([
          {
            name: user.name || "Unknown",
            phone: user.phoneNumber,
            notes: emergencyData.description,
            status: 'pending',
            location: locationData ? JSON.stringify(locationData) : null,
            timestamp: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Also create a record in orders_new for backward compatibility
      await supabase
        .from('orders_new')
        .insert({
          order_id: emergencyId,
          customer: user.phoneNumber,
          amount: 0, // Emergency services might be free or have a fixed cost
          setup_prescription: emergencyData.description,
          action: 'emergency_request'
        });

      // Simulate API call to emergency services
      // In a real app, this would actually call a real emergency service
      setTimeout(() => {
        setAmbulance({
          id: 'AMB-12345',
          driver: 'John Medic',
          vehicle: 'ZEP-4321',
          phone: '+911234567890'
        });
        setEta(Math.floor(Math.random() * 10) + 5); // Random ETA between 5-15 minutes
      }, 1500);

      setLoading(false);
      toast({
        title: "Emergency Services Requested",
        description: "Help is on the way!",
      });
      
      return data;
    } catch (err) {
      console.error("Error requesting emergency service:", err);
      
      setLoading(false);
      let errorMessage = "Failed to request emergency services.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  }, [user, toast]);

  // Cancel emergency request
  const cancelEmergencyRequest = useCallback(async (requestId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the emergency request status in Supabase
      const { error: supabaseError } = await supabase
        .from('emergency_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Update status in orders_new table for backward compatibility
      if (user?.phoneNumber) {
        await supabase
          .from('orders_new')
          .update({ action: 'cancelled' })
          .eq('customer', user.phoneNumber)
          .eq('action', 'emergency_request');
      }

      // Reset states
      setAmbulance(null);
      setEta(null);
      
      setLoading(false);
      
      toast({
        title: "Emergency Request Cancelled",
        description: "Your emergency request has been cancelled.",
      });
      
      return true;
    } catch (err) {
      console.error("Error cancelling emergency request:", err);
      
      setLoading(false);
      let errorMessage = "Failed to cancel emergency request.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast, user]);

  return {
    requestEmergencyService,
    cancelEmergencyRequest,
    loading,
    error,
    ambulance,
    eta,
    emergencyRequests
  };
};
