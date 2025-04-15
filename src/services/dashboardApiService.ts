
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
  }
  
  /**
   * Send a new emergency request to the dashboard
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<any> {
    return this.apiPost('/emergency/request', payload);
  }
  
  /**
   * Update the status of an emergency request
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<any> {
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
    return this.apiGet(`/emergency/responder/${requestId}`);
  }
  
  /**
   * Get ETA for an emergency request
   */
  public async getEmergencyEta(requestId: string): Promise<any> {
    return this.apiGet(`/emergency/eta/${requestId}`);
  }
  
  /**
   * Cancel an emergency request
   */
  public async cancelEmergencyRequest(requestId: string, reason?: string): Promise<any> {
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
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
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
      const url = new URL(`${this.apiBaseUrl}${endpoint}`);
      Object.keys(queryParams).forEach(key => {
        url.searchParams.append(key, queryParams[key]);
      });
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
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
