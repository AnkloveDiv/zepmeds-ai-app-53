
/**
 * Order Update Service
 * Handles order status update functionality
 */
import { getDashboardApiService } from '@/pages/dashboardApiService';
import { createOrderTrackingEvent } from './trackOrder';
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates the status of an existing order
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  console.log(`Updating status for order: ${orderId} to ${status}`);
  
  try {
    // Update through dashboard API
    const dashboardApi = getDashboardApiService();
    const response = await dashboardApi.updateOrderStatus(orderId, status);
    
    // Create a tracking event for this status update
    try {
      await createOrderTrackingEvent(orderId, status);
      
      // Also update the status in the orders_new table if it exists
      const { error } = await supabase
        .from('orders_new')
        .update({ action: status })
        .eq('order_id', orderId);
        
      if (error) {
        console.error('Error updating order status in orders_new table:', error);
      }
    } catch (trackingError) {
      console.error('Error creating tracking event:', trackingError);
    }
    
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

