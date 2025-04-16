
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
    const { data, error } = await supabase
      .from('orders_new')
      .insert([{
        order_id: orderData.orderId,
        customer: orderData.customer,
        amount: orderData.amount,
        setup_prescription: orderData.setupPrescription,
        action: orderData.action
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
}
