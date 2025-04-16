
/**
 * Emergency Service
 * Handles emergency-related API operations
 */

import { supabase } from '@/lib/supabase';
import { ApiClient } from './apiClient';
import { EmergencyRequestPayload, ApiResponse } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

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

  const apiClient = new ApiClient('https://api.zepmeds.com/v1');
  const emergencyService = new EmergencyService(apiClient);

  // Request emergency service
  const requestEmergencyService = useCallback(async (emergencyData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Generate a unique emergency ID
      const emergencyId = generateOrderId();
      
      // Log detailed information about the request
      console.log('Creating emergency request with data:', {
        userId: user.id,
        name: user.name || user.phoneNumber || "Unknown User",
        phone: user.phoneNumber || "Unknown",
        location: emergencyData.location || "Unknown location",
        lat: emergencyData.lat || null,
        lng: emergencyData.lng || null,
        description: emergencyData.description
      });
      
      // Create emergency record directly in emergency_requests table
      const { data, error: supabaseError } = await supabase
        .from('emergency_requests')
        .insert([
          {
            name: user.name || user.phoneNumber || "Unknown User",
            phone: user.phoneNumber || "Unknown",
            status: 'requested',
            notes: emergencyData.description,
            location: {
              address: emergencyData.location || "Unknown location",
              lat: emergencyData.lat || null,
              lng: emergencyData.lng || null
            }
          }
        ])
        .select()
        .single();

      if (supabaseError) {
        console.error("Error creating emergency request:", supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('Emergency request created successfully:', data);

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
      // Update status in emergency_requests table
      const { error: supabaseError } = await supabase
        .from('emergency_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
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
  }, [toast]);

  return {
    requestEmergencyService,
    cancelEmergencyRequest,
    loading,
    error,
    ambulance,
    eta
  };
};
