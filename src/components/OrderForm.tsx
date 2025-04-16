
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the form validation schema
const formSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  amount: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, { message: "Amount must be positive" })
  ),
  prescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const OrderForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      prescription: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // Generate a unique order ID
      const orderId = generateOrderId();
      
      // Create the order record
      const orderData = {
        order_id: orderId,
        customer: data.customerName,
        date: data.date,
        amount: data.amount,
        setup_prescription: data.prescription || null,
        action: "View Details"
      };
      
      console.log('Creating order in Supabase:', orderData);
      
      const { data: responseData, error } = await supabase
        .from('orders_new')
        .insert(orderData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Order Placed Successfully",
      });
      
      console.log('Order created:', responseData);
      
      // Reset form
      form.reset({
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        prescription: '',
      });
    } catch (err) {
      console.error('Error creating order:', err);
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescription</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter prescription details (optional)"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Submit Order"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
