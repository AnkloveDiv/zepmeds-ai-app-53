
/**
 * Order Tracking Service
 * Handles order tracking functionality
 */
import { supabase } from '@/integrations/supabase/client';
import { safeParseJSON, getProperty } from './utils';

/**
 * Maps database status values to frontend friendly status values
 */
const mapStatusValue = (dbStatus: string): string => {
  // Convert database status values to our standard status values
  const statusMap: Record<string, string> = {
    'created': 'processing',
    'confirmed': 'processing',
    'preparing': 'packed',
    'ready': 'packed',
    'picked_up': 'rider-pickup',
    'out_for_delivery': 'in-transit',
    'in_transit': 'in-transit',
    'delivered': 'delivered',
    'completed': 'delivered'
  };
  
  return statusMap[dbStatus.toLowerCase()] || dbStatus;
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
        .from('orders_new')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order from database:', error);
      } else if (data) {
        // Create default items if not available
        let parsedItems = [];
        try {
          // Try to access data.items safely - it may not exist in the schema
          const itemsString = getProperty<string>(data, 'items');
          
          if (itemsString) {
            parsedItems = safeParseJSON(itemsString, []);
          } else {
            // Since orders_new table might not have items column, we create a default item
            parsedItems = [{
              name: "Prescribed Medicine",
              quantity: 1,
              price: data.amount
            }];
          }
        } catch (parseError) {
          console.error('Error parsing items:', parseError);
          parsedItems = [{
            name: "Prescribed Medicine",
            quantity: 1,
            price: data.amount
          }];
        }
        
        // Try to parse location if available
        let location = null;
        try {
          // Try to access data.location safely - it may not exist in the schema
          const locationString = getProperty<string>(data, 'location');
          
          if (locationString) {
            location = safeParseJSON(locationString, null);
          }
        } catch (locError) {
          console.error('Error parsing location data:', locError);
        }
        
        // Get the latest status from order_tracking_events if available
        let currentStatus = data.action || 'processing';
        try {
          const { data: trackingData, error: trackingError } = await supabase
            .from('order_tracking_events')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!trackingError && trackingData && trackingData.length > 0) {
            currentStatus = trackingData[0].status;
          }
        } catch (trackingError) {
          console.error('Error getting latest tracking status:', trackingError);
        }

        // Transform to match expected format - handle the different schema of orders_new
        return {
          id: orderId,
          status: mapStatusValue(currentStatus),
          estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          deliveryRider: {
            name: "Rahul Singh",
            rating: 4.8,
            phone: "+91 98765 43210",
            eta: "15 minutes",
            profileImage: "https://source.unsplash.com/random/100x100/?face"
          },
          items: parsedItems, // Use parsed items
          totalAmount: data.amount, // Map from amount field
          deliveryAddress: "Customer address", // This doesn't exist in orders_new
          placedAt: data.created_at || data.date,
          location: location // Add location data
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
 * Creates a tracking event for an order
 */
export const createOrderTrackingEvent = async (orderId: string, status: string, description?: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('order_tracking_events')
      .insert([
        {
          order_id: orderId,
          status: status,
          description: description || `Order status updated to ${status}`
        }
      ]);
      
    if (error) {
      console.error('Error creating order tracking event:', error);
      throw error;
    }
    
    console.log('Created order tracking event:', data);
  } catch (error) {
    console.error('Failed to create order tracking event:', error);
    throw error;
  }
};
