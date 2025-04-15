
/**
 * API Services
 * 
 * This file exports all API services for the application
 */

export { 
  DashboardApiService, 
  getDashboardApiService
} from './dashboardApiService';

// Use 'export type' for type re-exports
export type {
  OrderDataPayload,
  EmergencyRequestPayload
} from './dashboardApiService';

export {
  OrderApiService,
  getOrderApiService
} from './orderApiService';

export {
  EmergencyApiService,
  getEmergencyApiService
} from './emergencyApiService';

export { BaseApiService } from './baseApiService';
