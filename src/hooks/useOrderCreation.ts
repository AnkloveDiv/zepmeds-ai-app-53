
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
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: orderData.customer_name,
            created_at: orderData.date,
            total: orderData.amount,
            prescription_image_url: orderData.prescription,
            status: 'pending',
            order_number: `ORD-${Date.now()}`
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      return data;
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
