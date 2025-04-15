
/**
 * Emergency API Service
 * 
 * Provides methods to interact with the Zepmeds Dashboard API for emergency operations
 */

import { BaseApiService } from './baseApiService';

export interface EmergencyRequestPayload {
  user: {
    id: string;
    name?: string;
    phone?: string;
    medicalConditions?: string[];
  };
  emergency: {
    type: string;
    status: string;
    location: {
      lat?: number | null;
      lng?: number | null;
      address: string;
    };
    description: string;
  };
}

export class EmergencyApiService extends BaseApiService {
  /**
   * Send a new emergency request to the dashboard
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<any> {
    console.log('Sending emergency request to dashboard:', payload);
    return this.apiPost('/emergency/request', payload);
  }
  
  /**
   * Update the status of an emergency request
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<any> {
    console.log(`Updating emergency status for ${requestId} to ${status}`);
    return this.apiPost('/emergency/update', {
      requestId,
      status,
      updatedAt: new Date().toISOString()
    });
  }
  
  /**
   * Get responder information for an emergency request
   */
  public async getResponderInfo(requestId: string): Promise<any> {
    console.log(`Getting responder info for request ${requestId}`);
    return this.apiGet(`/emergency/responder/${requestId}`);
  }
  
  /**
   * Get ETA for an emergency request
   */
  public async getEmergencyEta(requestId: string): Promise<any> {
    console.log(`Getting ETA for request ${requestId}`);
    return this.apiGet(`/emergency/eta/${requestId}`);
  }
  
  /**
   * Cancel an emergency request
   */
  public async cancelEmergencyRequest(requestId: string, reason?: string): Promise<any> {
    console.log(`Cancelling emergency request ${requestId}${reason ? ` with reason: ${reason}` : ''}`);
    return this.apiPost('/emergency/cancel', {
      requestId,
      reason,
      cancelledAt: new Date().toISOString()
    });
  }
  
  /**
   * Mock responder data for emergencies
   */
  protected getMockResponderData(): any {
    return {
      success: true,
      data: {
        id: 'resp-12345',
        name: 'Dr. Sarah Johnson',
        vehicle: 'ZEP-4321',
        phone: '+1234567890',
        currentLocation: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    };
  }
  
  /**
   * Mock ETA data for emergencies
   */
  protected getMockEtaData(): any {
    return {
      success: true,
      data: {
        eta: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
        distance: (Math.random() * 5).toFixed(1), // 0.1-5.0 km
        currentStatus: 'en_route'
      }
    };
  }
}

// Create singleton instance with more resilient initialization
let emergencyApiInstance: EmergencyApiService | null = null;

/**
 * Get or create the emergency API service
 */
export const getEmergencyApiService = (
  apiBaseUrl: string = 'https://preview--zepmeds-admin-hub-72.lovable.app/api', 
  apiKey: string = ''
): EmergencyApiService => {
  if (!emergencyApiInstance) {
    emergencyApiInstance = new EmergencyApiService(apiBaseUrl, apiKey);
  }
  return emergencyApiInstance;
};
