
/**
 * Zepmeds Dashboard API Service
 * 
 * Main API service for interacting with the Zepmeds Dashboard
 */

import { BaseApiService } from './baseApiService';
import { OrderApiService, getOrderApiService } from './orderApiService';
import type { OrderDataPayload } from './orderApiService';
import { EmergencyApiService, getEmergencyApiService } from './emergencyApiService';
import type { EmergencyRequestPayload } from './emergencyApiService';

/**
 * Dashboard API Service that combines all API functionality
 */
export class DashboardApiService extends BaseApiService {
  private orderService: OrderApiService;
  private emergencyService: EmergencyApiService;
  
  constructor(
    apiBaseUrl: string = 'https://preview--zepmeds-admin-hub-72.lovable.app/api',
    apiKey: string = ''
  ) {
    super(apiBaseUrl, apiKey);
    this.orderService = getOrderApiService(apiBaseUrl, apiKey);
    this.emergencyService = getEmergencyApiService(apiBaseUrl, apiKey);
    console.log('DashboardApiService initialized with URL:', apiBaseUrl);
  }
  
  // Order operations
  
  public sendOrderData(payload: OrderDataPayload): Promise<any> {
    return this.orderService.sendOrderData(payload);
  }
  
  public updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.orderService.updateOrderStatus(orderId, status);
  }
  
  // Emergency operations
  
  public sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<any> {
    return this.emergencyService.sendEmergencyRequest(payload);
  }
  
  public updateEmergencyStatus(requestId: string, status: string): Promise<any> {
    return this.emergencyService.updateEmergencyStatus(requestId, status);
  }
  
  public getResponderInfo(requestId: string): Promise<any> {
    return this.emergencyService.getResponderInfo(requestId);
  }
  
  public getEmergencyEta(requestId: string): Promise<any> {
    return this.emergencyService.getEmergencyEta(requestId);
  }
  
  public cancelEmergencyRequest(requestId: string, reason?: string): Promise<any> {
    return this.emergencyService.cancelEmergencyRequest(requestId, reason);
  }
}

// Create singleton instance with more resilient initialization
let dashboardApiInstance: DashboardApiService | null = null;

/**
 * Get or create the dashboard API service
 */
export const getDashboardApiService = (
  apiBaseUrl: string = 'https://preview--zepmeds-admin-hub-72.lovable.app/api', 
  apiKey: string = ''
): DashboardApiService => {
  if (!dashboardApiInstance) {
    dashboardApiInstance = new DashboardApiService(apiBaseUrl, apiKey);
  }
  return dashboardApiInstance;
};

// Re-export types for backward compatibility
export type { OrderDataPayload, EmergencyRequestPayload };
export { getOrderApiService, getEmergencyApiService };
