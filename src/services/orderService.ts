
/**
 * Order Service
 * Handles order creation and tracking functionality
 */
import { getDashboardApiService, OrderDataPayload } from '@/services/api';
import { supabase } from '@/lib/supabase';

/**
 * Creates a new order and sends it to both the local storage and admin dashboard
 */
export const createOrder = async (orderData: OrderDataPayload): Promise<any> => {
  console.log('Creating new order:', orderData);
  
  try {
    // Send to dashboard API
    const dashboardApi = getDashboardApiService();
    const response = await dashboardApi.sendOrderData(orderData);
    
    // Store in Supabase for the admin dashboard
    try {
      // First store in the orders table (for backward compatibility)
      const { data: orderDbData, error: orderError } = await supabase.from('orders').insert({
        order_number: orderData.orderNumber,
        delivery_address: orderData.customerInfo.address,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        payment_method: orderData.paymentMethod,
      });
      
      if (orderError) {
        console.error('Failed to store order in orders table:', orderError);
      } else {
        console.log('Order stored in orders database:', orderDbData);
      }
      
      // Also store in the new admin_dashboard_orders table
      const { data: dashboardOrderData, error: dashboardError } = await supabase.from('admin_dashboard_orders').insert({
        order_id: orderData.orderId,
        order_number: orderData.orderNumber,
        customer_name: orderData.customerInfo.name,
        customer_phone: orderData.customerInfo.phone || '',
        customer_address: orderData.customerInfo.address,
        status: orderData.status,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        items: JSON.stringify(orderData.items)
      });
      
      if (dashboardError) {
        console.error('Failed to store order in admin dashboard:', dashboardError);
      } else {
        console.log('Order stored in admin dashboard database:', dashboardOrderData);
        
        // Create an order tracking event
        const { error: eventError } = await supabase.from('order_tracking_events').insert({
          order_id: orderData.orderId,
          status: orderData.status,
          description: `Order ${orderData.orderNumber} has been ${orderData.status}`
        });
        
        if (eventError) {
          console.error('Failed to create order tracking event:', eventError);
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

/**
 * Updates the status of an order
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  console.log(`Updating order status for ${orderId} to ${status}`);
  
  try {
    // Update in dashboard API
    const dashboardApi = getDashboardApiService();
    const response = await dashboardApi.updateOrderStatus(orderId, status);
    
    // Update in Supabase database
    try {
      // Update in admin_dashboard_orders table
      const { error: dashboardError } = await supabase
        .from('admin_dashboard_orders')
        .update({ status })
        .eq('order_id', orderId);
      
      if (dashboardError) {
        console.error(`Failed to update order status in admin dashboard: ${dashboardError.message}`);
      }
      
      // Update in orders table (for backward compatibility)
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('order_number', orderId);
      
      if (orderError) {
        console.error(`Failed to update order status in orders table: ${orderError.message}`);
      }
      
      // Create an order tracking event
      const { error: eventError } = await supabase.from('order_tracking_events').insert({
        order_id: orderId,
        status,
        description: `Order status updated to ${status}`
      });
      
      if (eventError) {
        console.error('Failed to create order tracking event:', eventError);
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
    }
    
    // Update in localStorage if it exists
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        if (parsedOrder.id === orderId || parsedOrder.orderId === orderId) {
          parsedOrder.status = status;
          localStorage.setItem("currentOrder", JSON.stringify(parsedOrder));
        }
      } catch (e) {
        console.error("Error updating localStorage order:", e);
      }
    }
    
    return response;
  } catch (error) {
    console.error(`Error updating order status: ${error}`);
    throw error;
  }
};

/**
 * Retrieves order tracking information by order ID
 */
export const getOrderTracking = async (orderId: string): Promise<any> => {
  console.log(`Getting tracking info for order: ${orderId}`);
  
  try {
    // First check localStorage
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      if (parsedOrder.id === orderId || parsedOrder.orderId === orderId) {
        return parsedOrder;
      }
    }
    
    // Then try to get from Supabase
    try {
      // Try the new admin_dashboard_orders table first
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('admin_dashboard_orders')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (dashboardError) {
        console.error('Error fetching order from admin_dashboard_orders:', dashboardError);
      } else if (dashboardData) {
        // Get order tracking events
        const { data: events } = await supabase
          .from('order_tracking_events')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });
        
        // Transform to match expected format
        return {
          id: orderId,
          orderId: dashboardData.order_id,
          status: dashboardData.status,
          estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          deliveryRider: {
            name: "Rahul Singh",
            rating: 4.8,
            phone: "+91 98765 43210",
            eta: "15 minutes",
            profileImage: "https://source.unsplash.com/random/100x100/?face"
          },
          items: JSON.parse(dashboardData.items || '[]'),
          totalAmount: dashboardData.total_amount,
          deliveryAddress: dashboardData.customer_address,
          placedAt: dashboardData.created_at,
          events: events || []
        };
      }
      
      // Fall back to the orders table
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order from orders table:', error);
      } else if (data) {
        // Transform to match expected format
        return {
          id: orderId,
          status: data.status,
          estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          deliveryRider: {
            name: "Rahul Singh",
            rating: 4.8,
            phone: "+91 98765 43210",
            eta: "15 minutes",
            profileImage: "https://source.unsplash.com/random/100x100/?face"
          },
          items: [], // Would need to fetch items from order_items table
          totalAmount: data.total_amount,
          deliveryAddress: data.delivery_address,
          placedAt: data.created_at
        };
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
    }
    
    // If all else fails, create a mock order
    return {
      id: orderId,
      status: "in-transit",
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      deliveryRider: {
        name: "Rahul Singh",
        rating: 4.8,
        phone: "+91 98765 43210",
        eta: "15 minutes",
        profileImage: "https://source.unsplash.com/random/100x100/?face"
      },
      items: [
        {
          id: "med-1",
          name: "Paracetamol",
          image: "https://source.unsplash.com/random/100x100/?medicine",
          quantity: 2,
          stripQuantity: 10,
          price: 25
        }
      ],
      totalAmount: 500,
      deliveryAddress: "123 Main St, Apartment 4B, New York, NY 10001",
      placedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error in getOrderTracking:', error);
    throw error;
  }
};

/**
 * Gets all orders for the admin dashboard
 */
export const getAdminDashboardOrders = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_dashboard_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching admin dashboard orders:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAdminDashboardOrders:', error);
    return [];
  }
};
