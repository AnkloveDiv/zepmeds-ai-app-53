import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { getDashboardApiService } from '@/pages/dashboardApiService';
import { EmergencyRequestPayload } from '@/pages/dashboardApiService';

export interface EmergencyRequest {
  request_type: string;
  status: 'requested' | 'confirming' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  location_lat: number | null;
  location_lng: number | null;
  description: string;
}

// Hook to manage emergency services
export const useEmergencyService = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ambulance, setAmbulance] = useState<any>(null);
  const [eta, setEta] = useState<number | null>(null);

  // Request emergency service
  const requestEmergencyService = async (emergencyData: Partial<EmergencyRequest>) => {
    if (!user) {
      setError('User must be logged in to request emergency services');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get user's current position if available
      let position = null;
      try {
        if (navigator.geolocation) {
          position = await getCurrentPosition();
        }
      } catch (err) {
        console.error('Error getting location:', err);
      }
      
      // Prepare location data in format compatible with the emergency_requests table schema
      const locationData = {
        lat: position ? position.coords.latitude : (emergencyData.location_lat || null),
        lng: position ? position.coords.longitude : (emergencyData.location_lng || null),
        address: user.address || 'Unknown location' // This will be included in the location JSON object, not as a separate column
      };
      
      // Prepare request data according to the actual table schema
      const name = user.name || 'Unknown';
      const phone = user.phoneNumber || 'Unknown';
      const notes = emergencyData.description || 'Emergency assistance needed';
      
      console.log('Sending emergency request to Supabase with data:', {
        name,
        phone,
        location: locationData,
        notes
      });
      
      // Send to Supabase using the correct column structure matching the database schema
      const { data, error: supabaseError } = await supabase
        .from('emergency_requests')
        .insert({
          name: name,
          phone: phone,
          location: locationData, // This matches the JSONB 'location' column in the database
          notes: notes,
          status: 'requested'
        })
        .select()
        .single();
      
      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }
      
      console.log('Emergency request saved to Supabase:', data);
      
      // Also directly send to Zepmeds dashboard API
      try {
        const dashboardApi = getDashboardApiService();
        
        // Create a properly structured EmergencyRequestPayload object
        const dashboardRequestData: EmergencyRequestPayload = {
          user: {
            id: user.phoneNumber || '',
            name: user.name || 'Unknown',
            phone: user.phoneNumber
          },
          emergency: {
            type: emergencyData.request_type || 'ambulance',
            status: 'requested',
            location: {
              lat: locationData.lat,
              lng: locationData.lng,
              address: locationData.address
            },
            description: notes
          }
        };
        
        const dashboardResponse = await dashboardApi.sendEmergencyRequest(dashboardRequestData);
        console.log('Emergency request sent to dashboard API:', dashboardResponse);
      } catch (dashboardError) {
        // Log but continue - data will still sync through database
        console.error("Error sending to dashboard API:", dashboardError);
      }
      
      // Simulate finding a responder and ETA calculation
      // In a real app, this would come from the dashboard after assignment
      const simulatedEta = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
      setEta(simulatedEta);
      
      // Simulate ambulance data
      const ambulanceData = {
        id: `AMB-${Math.floor(Math.random() * 1000)}`,
        responder_name: 'Dr. Sarah Johnson',
        vehicle_number: `ZEP-${Math.floor(Math.random() * 10000)}`,
        phone_number: '+1234567890',
      };
      setAmbulance(ambulanceData);
      
      return data;
    } catch (err: any) {
      console.error('Error in requestEmergencyService:', err);
      setError(err.message || 'Failed to request emergency service');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update emergency request status
  const updateEmergencyStatus = async (requestId: string, status: EmergencyRequest['status']) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      console.log(`Updating emergency status for request ${requestId} to ${status}`);
      
      const { data, error: supabaseError } = await supabase
        .from('emergency_requests')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();
      
      if (supabaseError) {
        console.error('Error updating emergency status:', supabaseError);
        throw supabaseError;
      }
      
      console.log('Emergency status updated:', data);
      
      // Also update status on dashboard
      try {
        const dashboardApi = getDashboardApiService();
        await dashboardApi.updateEmergencyStatus(requestId, status);
      } catch (dashboardError) {
        console.error("Error updating dashboard API:", dashboardError);
      }
      
      return data;
    } catch (err: any) {
      console.error('Error in updateEmergencyStatus:', err);
      setError(err.message || 'Failed to update emergency status');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel emergency request
  const cancelEmergencyRequest = async (requestId: string) => {
    console.log(`Cancelling emergency request ${requestId}`);
    try {
      const data = await updateEmergencyStatus(requestId, 'cancelled');
      
      // Also cancel on dashboard
      try {
        const dashboardApi = getDashboardApiService();
        await dashboardApi.cancelEmergencyRequest(requestId);
      } catch (dashboardError) {
        console.error("Error cancelling on dashboard API:", dashboardError);
      }
      
      return data;
    } catch (err) {
      console.error('Error cancelling emergency request:', err);
      return null;
    }
  };
  
  // Helper function to get current position
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  return {
    requestEmergencyService,
    updateEmergencyStatus,
    cancelEmergencyRequest,
    loading,
    error,
    ambulance,
    eta
  };
};
