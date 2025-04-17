
import { supabase } from '@/integrations/supabase/client';
import { Address } from '../addressService';

interface CreateOrderParams {
  items: any[];
  totalAmount: number;
  deliveryAddressId: string;
  prescriptionUrl?: string;
  paymentMethod: string;
}

export const createOrder = async (orderData: CreateOrderParams): Promise<any> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate a unique order ID
    const orderId = `ZM${Math.floor(Math.random() * 10000)}`;
    
    // Create the order in Supabase
    const { data, error } = await supabase
      .from('orders_new')
      .insert({
        order_id: orderId,
        user_id: user.id,
        customer: user.email || 'Guest Customer',
        amount: orderData.totalAmount,
        items: JSON.stringify(orderData.items),
        delivery_address: orderData.deliveryAddressId,
        prescription_url: orderData.prescriptionUrl || null,
        action: "processing",
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // Save to localStorage for tracking
    const order = {
      id: orderId,
      status: "confirmed",
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      deliveryRider: {
        name: "Rahul Singh",
        rating: 4.8,
        phone: "+91 98765 43210",
        eta: "15 minutes",
        profileImage: "https://source.unsplash.com/random/100x100/?face"
      },
    };
    
    localStorage.setItem("currentOrder", JSON.stringify(order));
    localStorage.setItem("cart", JSON.stringify([]));
    
    return { orderId, orderData: data };
    
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};
