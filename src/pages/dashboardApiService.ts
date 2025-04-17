
import { OrderDataPayload } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

class DashboardApiService {
  async sendOrderData(orderData: OrderDataPayload): Promise<void> {
    try {
      await supabase
        .from('admin_dashboard_orders')
        .insert({
          order_id: orderData.orderId,
          order_number: orderData.orderNumber,
          customer_name: orderData.customerInfo.name,
          customer_phone: orderData.customerInfo.phone,
          customer_address: orderData.customerInfo.address,
          items: orderData.items,
          status: orderData.status,
          total_amount: orderData.totalAmount,
          payment_method: orderData.paymentMethod,
          created_at: orderData.createdAt
        });
    } catch (error) {
      console.error("Error sending order to dashboard:", error);
      throw error;
    }
  }
}

// Singleton pattern to ensure we always use the same instance
let dashboardApiService: DashboardApiService;

export const getDashboardApiService = (): DashboardApiService => {
  if (!dashboardApiService) {
    dashboardApiService = new DashboardApiService();
  }
  return dashboardApiService;
};
