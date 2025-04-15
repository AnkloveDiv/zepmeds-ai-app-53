
/**
 * Zepmeds Dashboard API Service
 * 
 * Provides methods to interact with the Zepmeds Ambulance dashboard API
 */

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
      lat?: number;
      lng?: number;
      address: string;
    };
    description: string;
  };
}

export class DashboardApiService {
  private apiBaseUrl: string;
  private apiKey: string;
  
  constructor(apiBaseUrl: string = 'https://api.zepmeds-dashboard.example', apiKey: string = '') {
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
    console.log('DashboardApiService initialized with URL:', apiBaseUrl);
  }
  
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
   * Send a POST request to the dashboard API
   */
  private async apiPost(endpoint: string, data: any): Promise<any> {
    try {
      // For demonstration purposes, log the API call and mock a response
      console.log(`[DASHBOARD API MOCK] POST ${this.apiBaseUrl}${endpoint}`, data);
      
      // In a real implementation, this would be:
      /*
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      */
      
      // Mock successful response
      return {
        success: true,
        message: `Successfully processed request to ${endpoint}`,
        data: { ...data, id: `mock-id-${Date.now()}` }
      };
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Send a GET request to the dashboard API
   */
  private async apiGet(endpoint: string, queryParams: Record<string, string> = {}): Promise<any> {
    try {
      // Construct URL with query parameters
      const url = new URL(`${this.apiBaseUrl}${endpoint}`);
      Object.keys(queryParams).forEach(key => {
        url.searchParams.append(key, queryParams[key]);
      });
      
      // For demonstration purposes, log the API call and mock a response
      console.log(`[DASHBOARD API MOCK] GET ${url.toString()}`);
      
      // In a real implementation, this would be:
      /*
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      */
      
      // Mock response based on endpoint
      if (endpoint.includes('/responder/')) {
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
      } else if (endpoint.includes('/eta/')) {
        return {
          success: true,
          data: {
            eta: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
            distance: (Math.random() * 5).toFixed(1), // 0.1-5.0 km
            currentStatus: 'en_route'
          }
        };
      } else {
        return {
          success: true,
          message: `Successfully retrieved data from ${endpoint}`
        };
      }
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Get headers for API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-App-Source': 'zepmeds-mobile-app',
      'X-App-Version': '1.0.0'
    };
  }
}

// Create singleton instance
let dashboardApiInstance: DashboardApiService | null = null;

/**
 * Get or create the dashboard API service
 */
export const getDashboardApiService = (
  apiBaseUrl?: string, 
  apiKey?: string
): DashboardApiService => {
  if (!dashboardApiInstance) {
    dashboardApiInstance = new DashboardApiService(apiBaseUrl, apiKey);
  }
  return dashboardApiInstance;
};
