
import { supabase } from '@/integrations/supabase/client';

interface CreateOrderInput {
  orderId: string;
  customer: string;
  amount: number;
  setupPrescription?: string;
  action?: string;
}

export async function createOrder(orderData: CreateOrderInput) {
  try {
    console.log('createOrder service called with data:', orderData);
    
    // Generate a unique timestamp to prevent collisions
    const timestamp = new Date().toISOString();
    
    // Create the order with enhanced logging
    const { data, error } = await supabase
      .from('orders_new')
      .insert([{
        order_id: orderData.orderId,
        customer: orderData.customer,
        amount: orderData.amount,
        setup_prescription: orderData.setupPrescription,
        action: orderData.action || 'created_via_service',
        date: timestamp
      }])
      .select();

    if (error) {
      console.error('Error creating order in ordersService:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Try with a different timestamp approach
      console.log('Trying with explicit timestamp...');
      const secondAttempt = await supabase
        .from('orders_new')
        .insert([{
          order_id: `${orderData.orderId}-retry`,
          customer: orderData.customer,
          amount: orderData.amount,
          setup_prescription: orderData.setupPrescription,
          action: 'created_via_service_retry',
          date: new Date().toISOString()
        }])
        .select();
        
      if (secondAttempt.error) {
        console.error('Second attempt also failed:', secondAttempt.error);
        throw secondAttempt.error;
      }
      
      console.log('Second attempt successful:', secondAttempt.data);
      return { success: true, data: secondAttempt.data };
    }

    console.log('Order successfully created in ordersService:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in createOrder service:', error);
    throw error;
  }
}
