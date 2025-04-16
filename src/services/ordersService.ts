
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
    
    // Log database status before insert
    try {
      const { count, error: countError } = await supabase
        .from('orders_new')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Current orders_new table has ${count} records`);
      if (countError) {
        console.error('Error checking orders_new table:', countError);
      }
    } catch (e) {
      console.error('Error querying orders_new table:', e);
    }
    
    const { data, error } = await supabase
      .from('orders_new')
      .insert([{
        order_id: orderData.orderId,
        customer: orderData.customer,
        amount: orderData.amount,
        setup_prescription: orderData.setupPrescription,
        action: orderData.action,
        // Explicitly set date to ensure it's not null
        date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order in ordersService:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Check for RLS issues
      if (error.message && error.message.includes('policy')) {
        console.error('RLS policy error detected in ordersService');
      }
      throw error;
    }

    console.log('Order successfully created in ordersService:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in createOrder service:', error);
    throw error;
  }
}
