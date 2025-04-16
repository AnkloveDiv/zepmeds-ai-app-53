
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
      
      // First try inserting into orders table
      const { data: orderData1, error: orderError1 } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customer_name,
          created_at: createdAt,
          total: orderData.amount,
          prescription_image_url: orderData.prescription || null,
          status: 'pending',
          order_number: `ORD-${Date.now()}`
        })
        .select()
        .single();

      if (orderError1) {
        console.error('Error creating order in orders table:', orderError1);
        // Try inserting into orders_new as backup
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
          throw new Error('Failed to create order in any available table');
        }
        
        console.log('Order created in orders_new table:', orderData2);
        toast({
          title: "Success",
          description: "Order placed successfully in orders_new!",
        });
        
        return orderData2;
      }

      console.log('Order created in orders table:', orderData1);
      toast({
        title: "Success",
        description: "Order placed successfully in orders!",
      });

      return orderData1;
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
