
/**
 * Dashboard emergency service
 * Handles emergency-related API operations
 */

import { ApiClient } from './apiClient';
import { EmergencyRequestPayload, ApiResponse } from './types';

export class EmergencyService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  /**
   * Send a new emergency request to the dashboard
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<ApiResponse> {
    console.log('Sending emergency request to dashboard:', payload);
    return this.apiClient.post<ApiResponse>('/emergency/request', payload);
  }
  
  /**
   * Update the status of an emergency request
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<ApiResponse> {
    console.log(`Updating emergency status for ${requestId} to ${status}`);
    return this.apiClient.post<ApiResponse>('/emergency/update', {
      requestId,
      status,
      updatedAt: new Date().toISOString()
    });
  }
  
  /**
   * Get responder information for an emergency request
   */
  public async getResponderInfo(requestId: string): Promise<ApiResponse> {
    console.log(`Getting responder info for request ${requestId}`);
    return this.apiClient.get<ApiResponse>(`/emergency/responder/${requestId}`);
  }
  
  /**
   * Get ETA for an emergency request
   */
  public async getEmergencyEta(requestId: string): Promise<ApiResponse> {
    console.log(`Getting ETA for request ${requestId}`);
    return this.apiClient.get<ApiResponse>(`/emergency/eta/${requestId}`);
  }
  
  /**
   * Cancel an emergency request
   */
  public async cancelEmergencyRequest(requestId: string, reason?: string): Promise<ApiResponse> {
    console.log(`Cancelling emergency request ${requestId}${reason ? ` with reason: ${reason}` : ''}`);
    return this.apiClient.post<ApiResponse>('/emergency/cancel', {
      requestId,
      reason,
      cancelledAt: new Date().toISOString()
    });
  }
}
