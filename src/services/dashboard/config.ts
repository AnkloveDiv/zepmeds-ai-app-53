
/**
 * Dashboard API configuration
 */

// API URL configuration
export const DASHBOARD_API_URL = 'https://lovable.dev/projects/fad9d36d-9f80-4f19-94e1-7c9f544c1020/api';

// Request configuration
export const API_REQUEST_CONFIG = {
  maxRetries: 3,
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'X-App-Source': 'zepmeds-mobile-app',
    'X-App-Version': '1.0.0',
    'Accept': 'application/json',
    'X-Dashboard-Connection': 'true'
  }
};

// Singleton instance for the dashboard API service
// Moved to index.ts to avoid circular dependencies
