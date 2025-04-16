
/**
 * Order Service
 * Backwards compatibility layer for existing code
 * 
 * @deprecated - Please use the modular imports from src/services/orders instead
 */
import { createOrder } from './orders/createOrder';
import { getOrderTracking } from './orders/trackOrder';
import { updateOrderStatus } from './orders/updateOrder';

// Re-export the functions for backwards compatibility
export {
  createOrder,
  getOrderTracking,
  updateOrderStatus
};
