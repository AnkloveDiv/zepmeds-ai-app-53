
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck, MapPin, ShoppingBag } from 'lucide-react';
import { useOrderStatusUpdates } from '@/hooks/useOrderStatusUpdates';
import { format } from 'date-fns';

// Define our order statuses in the correct sequence
const ORDER_STATUSES = [
  { value: 'processing', label: 'Order Confirmed', icon: Check },
  { value: 'packed', label: 'Preparing', icon: Package },
  { value: 'rider-pickup', label: 'Rider Pickup', icon: ShoppingBag },
  { value: 'in-transit', label: 'On the Way', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: MapPin }
];

interface OrderStatusTimelineProps {
  orderId: string;
  compact?: boolean;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ orderId, compact = false }) => {
  const { currentStatus, statusHistory, loading, error, estimatedDelivery } = useOrderStatusUpdates(orderId);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-6 h-6 border-2 border-t-zepmeds-purple border-r-transparent border-b-zepmeds-purple border-l-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-400">Loading status...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-3 px-4 bg-red-900/20 border border-red-800/30 rounded-lg my-3">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  // Find the current status index
  const currentStatusIndex = ORDER_STATUSES.findIndex(status => status.value === currentStatus);
  
  // Format the estimated delivery time
  const formattedETA = estimatedDelivery 
    ? format(new Date(estimatedDelivery), 'h:mm a')
    : null;

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} glass-morphism rounded-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-white`}>Order Status</h3>
        {formattedETA && (
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-3 w-3 mr-1 text-zepmeds-purple" />
            <span>ETA: {formattedETA}</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-700 z-0"></div>

        {/* Status steps */}
        {ORDER_STATUSES.map((status, index) => {
          const StatusIcon = status.icon;
          const isCompleted = currentStatusIndex >= index;
          const isCurrent = currentStatusIndex === index;
          const isPending = currentStatusIndex < index;
          
          // Define colors based on status
          let iconBgColor = 'bg-gray-700'; // Default for pending
          let iconColor = 'text-gray-400';
          let textColor = 'text-gray-400';
          
          if (isCompleted && !isCurrent) {
            // Completed
            iconBgColor = 'bg-green-500';
            iconColor = 'text-white';
            textColor = 'text-green-500';
          } else if (isCurrent) {
            // Current/active
            iconBgColor = 'bg-orange-500';
            iconColor = 'text-white';
            textColor = 'text-orange-500';
          }
          
          return (
            <div key={status.value} className="flex items-start mb-4 relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconBgColor}`}>
                {isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                ) : (
                  <StatusIcon className={`h-3 w-3 ${iconColor}`} />
                )}
              </div>
              
              <div className="ml-4">
                <p className={`font-medium ${textColor}`}>
                  {status.label}
                </p>
                
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-orange-500"
                  >
                    In progress...
                  </motion.p>
                )}

                {isCompleted && !isCurrent && statusHistory.find(hist => hist.status === status.value) && (
                  <p className="text-xs text-gray-400">
                    {format(
                      new Date(statusHistory.find(hist => hist.status === status.value)?.timestamp || ''),
                      'MMM d, h:mm a'
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {currentStatus === 'delivered' && (
        <div className="mt-4 bg-green-900/20 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="text-green-500 font-medium">Delivery Completed</h4>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Your order was delivered successfully. Thank you for shopping with us!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStatusTimeline;
