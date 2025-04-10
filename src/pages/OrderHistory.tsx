
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Package, ChevronRight, Calendar, Clock } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Order {
  id: string;
  date: string;
  time: string;
  status: 'delivered' | 'processing' | 'canceled';
  items: number;
  total: number;
}

const OrderHistory = () => {
  useBackNavigation();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD123456',
      date: '10 Apr 2025',
      time: '14:30',
      status: 'delivered',
      items: 3,
      total: 1240
    },
    {
      id: 'ORD123455',
      date: '05 Apr 2025',
      time: '10:15',
      status: 'delivered',
      items: 2,
      total: 850
    },
    {
      id: 'ORD123454',
      date: '28 Mar 2025',
      time: '16:45',
      status: 'canceled',
      items: 1,
      total: 450
    },
    {
      id: 'ORD123453',
      date: '20 Mar 2025',
      time: '09:30',
      status: 'delivered',
      items: 4,
      total: 1580
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500';
      case 'canceled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleViewOrder = (orderId: string) => {
    // Navigate to order details page
    console.log(`View order: ${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Order History" />
      
      <main className="px-4 py-6">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4 pr-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="glass-morphism rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-zepmeds-purple/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-zepmeds-purple" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">{order.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex text-gray-400 text-xs mt-1">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{order.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{order.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white">{order.items}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">₹{order.total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-3 text-zepmeds-purple hover:bg-zepmeds-purple/10 flex items-center justify-center gap-1"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderHistory;
