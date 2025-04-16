
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface OrderInput {
  customer_name: string;
  date: Date;
  amount: number;
  prescription?: string;
}

export const useOrderCreation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createOrder = async (orderData: OrderInput) => {
    setLoading(true);
    try {
      // Convert Date to ISO string format for Supabase
      const createdAt = orderData.date.toISOString();
      
      console.log('Attempting to create order in orders_new table directly:', {
        customer: orderData.customer_name,
        date: createdAt,
        amount: orderData.amount,
        setup_prescription: orderData.prescription || null
      });
      
      // Insert directly into orders_new table - no fallbacks
      const { data: orderData2, error: orderError2 } = await supabase
        .from('orders_new')
        .insert({
          customer: orderData.customer_name,
          date: createdAt,
          amount: orderData.amount,
          setup_prescription: orderData.prescription || null,
          order_id: `ORD-${Date.now()}`
        })
        .select()
        .single();
        
      if (orderError2) {
        console.error('Error creating order in orders_new table:', orderError2);
        console.error('Error details:', JSON.stringify(orderError2));
        
        // Check specifically for RLS errors
        if (orderError2.message && orderError2.message.includes('policy')) {
          console.error('RLS policy error detected. Please check your database policies.');
        }
        
        toast({
          title: "Error",
          description: "Failed to create order. Database error occurred.",
          variant: "destructive",
        });
        throw new Error('Failed to create order in orders_new table');
      }
      
      console.log('Order created in orders_new table:', orderData2);
      toast({
        title: "Success",
        description: "Order placed successfully in orders_new!",
      });
      
      return orderData2;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading
  };
};
