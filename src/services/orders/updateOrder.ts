
/**
 * Order Update Service
 * Handles order status update functionality
 */
import { getDashboardApiService } from '@/pages/dashboardApiService';

/**
 * Updates the status of an existing order
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  console.log(`Updating status for order: ${orderId} to ${status}`);
  
  try {
    // Update through dashboard API
    const dashboardApi = getDashboardApiService();
    const response = await dashboardApi.updateOrderStatus(orderId, status);
    
    // Update local storage if present
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      if (parsedOrder.id === orderId || parsedOrder.orderId === orderId) {
        parsedOrder.status = status;
        localStorage.setItem("currentOrder", JSON.stringify(parsedOrder));
      }
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to update order status: ${error}`);
    throw error;
  }
};
