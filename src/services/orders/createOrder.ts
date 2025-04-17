
import { supabase } from '@/integrations/supabase/client';
import { OrderCreatePayload } from '@/types/order';

export const createOrder = async (orderData: OrderCreatePayload): Promise<{ orderId: string }> => {
  try {
    // Generate a unique order ID with timestamp
    const orderId = `ZM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create the order in the database
    const { data, error } = await supabase
      .from('orders_new')
      .insert({
        order_id: orderId,
        user_id: user.id,
        customer: user.id, // We're using the user ID as the customer reference
        delivery_address: orderData.deliveryAddressId,
        items: orderData.items,
        amount: orderData.totalAmount,
        prescription_url: orderData.prescriptionUrl || null,
      })
      .select('id, order_id')
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    // Create an initial tracking event for the order
    await supabase
      .from('order_tracking_events')
      .insert({
        order_id: orderId,
        status: 'created',
        description: 'Order has been received'
      });
    
    return { orderId };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};
