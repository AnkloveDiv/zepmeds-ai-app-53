
/**
 * Dashboard API Service
 * 
 * Entry point for the dashboard API services
 */

import { ApiClient } from './apiClient';
import { OrderService } from './orderService';
import { EmergencyService } from './emergencyService';
import { DASHBOARD_API_URL } from './config';
import type { EmergencyRequestPayload, OrderDataPayload, ApiResponse } from './types';

export { EmergencyRequestPayload, OrderDataPayload, ApiResponse };

export class DashboardApiService {
  private apiClient: ApiClient;
  private orderService: OrderService;
  private emergencyService: EmergencyService;
  
  constructor(apiBaseUrl: string = DASHBOARD_API_URL, apiKey: string = '') {
    this.apiClient = new ApiClient(apiBaseUrl, apiKey);
    this.orderService = new OrderService(this.apiClient);
    this.emergencyService = new EmergencyService(this.apiClient);
    
    console.log('DashboardApiService initialized with URL:', apiBaseUrl);
  }
  
  // Order Service Methods
  
  /**
   * Send order data to the admin dashboard
   */
  public async sendOrderData(payload: OrderDataPayload): Promise<ApiResponse> {
    return this.orderService.sendOrderData(payload);
  }
  
  /**
   * Create a tracking event for an order
   */
  public async createOrderTrackingEvent(orderId: string, status: string, description?: string): Promise<any> {
    return this.orderService.createOrderTrackingEvent(orderId, status, description);
  }
  
  /**
   * Update order status in the admin dashboard
   */
  public async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
    return this.orderService.updateOrderStatus(orderId, status);
  }
  
  // Emergency Service Methods
  
  /**
   * Send a new emergency request to the dashboard
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<ApiResponse> {
    return this.emergencyService.sendEmergencyRequest(payload);
  }
  
  /**
   * Update the status of an emergency request
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<ApiResponse> {
    return this.emergencyService.updateEmergencyStatus(requestId, status);
  }
  
  /**
   * Get responder information for an emergency request
   */
  public async getResponderInfo(requestId: string): Promise<ApiResponse> {
    return this.emergencyService.getResponderInfo(requestId);
  }
  
  /**
   * Get ETA for an emergency request
   */
  public async getEmergencyEta(requestId: string): Promise<ApiResponse> {
    return this.emergencyService.getEmergencyEta(requestId);
  }
  
  /**
   * Cancel an emergency request
   */
  public async cancelEmergencyRequest(requestId: string, reason?: string): Promise<ApiResponse> {
    return this.emergencyService.cancelEmergencyRequest(requestId, reason);
  }
}

// Singleton instance with proper module pattern
let dashboardApiInstance: DashboardApiService | null = null;

/**
 * Get or create the dashboard API service
 */
export const getDashboardApiService = (
  apiBaseUrl: string = DASHBOARD_API_URL, 
  apiKey: string = ''
): DashboardApiService => {
  if (!dashboardApiInstance) {
    dashboardApiInstance = new DashboardApiService(apiBaseUrl, apiKey);
  }
  return dashboardApiInstance;
};
