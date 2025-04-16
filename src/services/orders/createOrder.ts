
/**
 * Order Creation Service
 * Handles order creation functionality
 */
import { getDashboardApiService } from '@/pages/dashboardApiService';
import { OrderDataPayload } from '@/pages/dashboardApiService';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLocation, LocationData } from './utils';

/**
 * Creates a new order and sends it to both the local storage and admin dashboard
 */
export const createOrder = async (orderData: OrderDataPayload): Promise<any> => {
  console.log('Creating new order:', orderData);
  
  try {
    // Send to dashboard API
    const dashboardApi = getDashboardApiService();
    
    // Log attempt to ensure we're calling the API
    console.log('Sending order to admin dashboard:', {
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      customerInfo: orderData.customerInfo,
      items: orderData.items?.length || 0,
      totalAmount: orderData.totalAmount
    });
    
    const response = await dashboardApi.sendOrderData(orderData);
    console.log('Order successfully sent to admin dashboard:', response);
    
    // Also attempt to store in Supabase directly (as a backup)
    try {
      console.log('Attempting to store order directly in database...');
      
      // Get location data if available
      const location = await getCurrentLocation();
      
      const orderRecord = {
        order_id: orderData.orderId,
        order_number: orderData.orderNumber,
        customer_name: orderData.customerInfo.name,
        customer_phone: orderData.customerInfo.phone || '',
        customer_address: orderData.customerInfo.address,
        status: orderData.status,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        items: JSON.stringify(orderData.items),
        created_at: orderData.createdAt,
        location: location ? JSON.stringify(location) : null
      };
      
      const { data, error } = await supabase
        .from('admin_dashboard_orders')
        .insert(orderRecord);
      
      if (error) {
        console.error('Failed to store order directly in database:', error);
        console.error('Error details:', JSON.stringify(error));
      } else {
        console.log('Order stored directly in database:', data);
        
        // Create an initial tracking event for this order
        try {
          await dashboardApi.createOrderTrackingEvent(
            orderData.orderId, 
            orderData.status, 
            `Order created with status: ${orderData.status}`
          );
        } catch (trackingError) {
          console.error('Error creating tracking event:', trackingError);
        }
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      // Continue execution even if database operation fails
    }
    
    // Store in localStorage for order tracking
    localStorage.setItem('currentOrder', JSON.stringify({
      ...orderData,
      id: orderData.orderId,
      placedAt: orderData.createdAt,
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      deliveryRider: {
        name: "Rahul Singh",
        rating: 4.8,
        phone: "+91 98765 43210",
        eta: "15 minutes",
        profileImage: "https://source.unsplash.com/random/100x100/?face"
      },
      address: {
        address: orderData.customerInfo.address
      }
    }));
    
    return response;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};
