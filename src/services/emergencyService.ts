/**
 * Emergency Service
 * Handles emergency-related API operations
 */

import { supabase } from '@/lib/supabase';
import { ApiClient } from './apiClient';
import { EmergencyRequestPayload, ApiResponse } from './types';
import { useAuth } from '@/contexts/AuthContext';

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
