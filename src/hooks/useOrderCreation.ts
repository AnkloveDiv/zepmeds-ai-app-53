
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
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          // Store phone number as customer_id temporarily (we'll update this later with a proper relationship)
          customer_name: orderData.customer_name, // This will be stored in metadata or used elsewhere
          created_at: createdAt,
          total: orderData.amount,
          prescription_image_url: orderData.prescription || null,
          status: 'pending',
          order_number: `ORD-${Date.now()}`
        })
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
