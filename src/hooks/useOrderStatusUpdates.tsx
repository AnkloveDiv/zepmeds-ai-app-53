
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getOrderTracking } from '@/services/orders/trackOrder';

export interface OrderStatus {
  status: string;
  timestamp: string;
  orderId: string;
}

export function useOrderStatusUpdates(orderId: string) {
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [statusHistory, setStatusHistory] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string | null>(null);

  // Load initial order data
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        if (!orderId) {
          setError('No order ID provided');
          setLoading(false);
          return;
        }

        // Get current order data
        const orderData = await getOrderTracking(orderId);
        
        if (!orderData) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        
        // Set current status and estimated delivery time
        setCurrentStatus(orderData.status);
        setEstimatedDelivery(orderData.estimatedDelivery);
        
        // Get status history from the tracking events table
        const { data: trackingEvents, error: trackingError } = await supabase
          .from('order_tracking_events')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true });
          
        if (trackingError) {
          console.error('Error fetching order tracking events:', trackingError);
        } else if (trackingEvents && trackingEvents.length > 0) {
          setStatusHistory(
            trackingEvents.map((event) => ({
              status: event.status,
              timestamp: event.created_at,
              orderId: event.order_id
            }))
          );
        } else {
          // If no tracking events found, create an initial one based on order data
          setStatusHistory([{
            status: orderData.status,
            timestamp: orderData.placedAt,
            orderId: orderId
          }]);
        }
      } catch (err) {
        console.error('Error in useOrderStatusUpdates:', err);
        setError('Failed to load order status data');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  // Subscribe to real-time updates for the order and tracking events
  useEffect(() => {
    if (!orderId) return;
    
    // Subscribe to changes in the order_tracking_events table
    const trackingChannel = supabase
      .channel('order-tracking-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_tracking_events',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('New tracking event:', payload);
          const newEvent = payload.new as any;
          
          // Update the current status
          setCurrentStatus(newEvent.status);
          
          // Add to status history
          setStatusHistory(prev => [
            ...prev,
            {
              status: newEvent.status,
              timestamp: newEvent.created_at,
              orderId: newEvent.order_id
            }
          ]);
        }
      )
      .subscribe();

    // Subscribe to changes in orders table for any other updates
    const ordersChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders_new',
          filter: `order_id=eq.${orderId}`
        },
        async (payload) => {
          console.log('Order updated:', payload);
          // Refresh order data when updated
          try {
            const orderData = await getOrderTracking(orderId);
            if (orderData) {
              setCurrentStatus(orderData.status);
              setEstimatedDelivery(orderData.estimatedDelivery);
            }
          } catch (err) {
            console.error('Error refreshing order data:', err);
          }
        }
      )
      .subscribe();

    return () => {
      // Clean up subscriptions
      supabase.removeChannel(trackingChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [orderId]);

  return {
    currentStatus,
    statusHistory,
    loading,
    error,
    estimatedDelivery
  };
}
