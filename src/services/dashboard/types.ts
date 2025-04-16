
/**
 * Dashboard API service types
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
      lat?: number | null;
      lng?: number | null;
      address: string;
    };
    description: string;
  };
}

export interface OrderDataPayload {
  orderId: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    phone?: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
