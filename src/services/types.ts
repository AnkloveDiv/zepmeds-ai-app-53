
/**
 * Common types for API services
 */

export interface EmergencyRequestPayload {
  request_type: string;
  status: string;
  description: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  user_id?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  id?: string;
}
