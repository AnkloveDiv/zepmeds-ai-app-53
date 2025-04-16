
/**
 * Dashboard API Service
 * Main export file for dashboard API services
 */

import { DASHBOARD_API_URL } from './config';
import { ApiClient } from './apiClient';
import { OrderService } from './orderService';
import { EmergencyService } from './emergencyService';
import type { OrderDataPayload, EmergencyRequestPayload, ApiResponse } from './types';

// Create a singleton instance for the dashboard API service
let dashboardApiInstance: DashboardApiService | null = null;

/**
 * Dashboard API Service class
 * Handles interaction with the admin dashboard API
 */
export class DashboardApiService {
  private apiClient: ApiClient;
  public order: OrderService;
  public emergency: EmergencyService;
  
  constructor(apiUrl: string, apiKey: string = '') {
    this.apiClient = new ApiClient(apiUrl, apiKey);
    this.order = new OrderService(this.apiClient);
    this.emergency = new EmergencyService(this.apiClient);
  }
  
  /**
   * Send order data to the admin dashboard
   * @deprecated Use order.sendOrderData instead
   */
  public async sendOrderData(payload: OrderDataPayload): Promise<ApiResponse> {
    console.warn('Deprecated: Use order.sendOrderData instead of sendOrderData');
    return this.order.sendOrderData(payload);
  }
  
  /**
   * Create a tracking event for an order
   * @deprecated Use order.createOrderTrackingEvent instead
   */
  public async createOrderTrackingEvent(orderId: string, status: string, description?: string): Promise<any> {
    console.warn('Deprecated: Use order.createOrderTrackingEvent instead of createOrderTrackingEvent');
    return this.order.createOrderTrackingEvent(orderId, status, description);
  }
  
  /**
   * Update order status in the admin dashboard
   * @deprecated Use order.updateOrderStatus instead
   */
  public async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
    console.warn('Deprecated: Use order.updateOrderStatus instead of updateOrderStatus');
    return this.order.updateOrderStatus(orderId, status);
  }
  
  /**
   * Send emergency request to the admin dashboard
   * @deprecated Use emergency.sendEmergencyRequest instead
   */
  public async sendEmergencyRequest(payload: EmergencyRequestPayload): Promise<ApiResponse> {
    console.warn('Deprecated: Use emergency.sendEmergencyRequest instead of sendEmergencyRequest');
    return this.emergency.sendEmergencyRequest(payload);
  }
  
  /**
   * Update emergency status in the admin dashboard
   * @deprecated Use emergency.updateEmergencyStatus instead
   */
  public async updateEmergencyStatus(requestId: string, status: string): Promise<ApiResponse> {
    console.warn('Deprecated: Use emergency.updateEmergencyStatus instead of updateEmergencyStatus');
    return this.emergency.updateEmergencyStatus(requestId, status);
  }
  
  /**
   * Cancel emergency request in the admin dashboard
   * @deprecated Use emergency.cancelEmergencyRequest instead
   */
  public async cancelEmergencyRequest(requestId: string): Promise<ApiResponse> {
    console.warn('Deprecated: Use emergency.cancelEmergencyRequest instead of cancelEmergencyRequest');
    return this.emergency.cancelEmergencyRequest(requestId);
  }
}

/**
 * Get the dashboard API service instance
 * @returns DashboardApiService instance
 */
export function getDashboardApiService(): DashboardApiService {
  if (!dashboardApiInstance) {
    dashboardApiInstance = new DashboardApiService(DASHBOARD_API_URL);
  }
  return dashboardApiInstance;
}

// Export types
export type { OrderDataPayload, EmergencyRequestPayload, ApiResponse };
