
/**
 * Order Service
 * Handles order creation and tracking functionality
 */
import { getDashboardApiService, OrderDataPayload } from '@/pages/dashboardApiService';
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
    
    // Also attempt to store in Supabase (if available)
    try {
      const { data, error } = await supabase.from('orders').insert({
        order_number: orderData.orderNumber,
        delivery_address: orderData.customerInfo.address,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        payment_method: orderData.paymentMethod,
      });
      
      if (error) {
        console.error('Failed to store order in database:', error);
        // Continue execution even if database store fails
      } else {
        console.log('Order stored in database:', data);
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
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order from database:', error);
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
