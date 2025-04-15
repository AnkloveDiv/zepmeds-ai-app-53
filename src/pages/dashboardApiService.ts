
// Re-export from the main API service file
export { 
  DashboardApiService, 
  getDashboardApiService
} from '../services/api/dashboardApiService';

// Use 'export type' for type re-exports
export type { 
  OrderDataPayload,
  EmergencyRequestPayload
} from '../services/api/dashboardApiService';
