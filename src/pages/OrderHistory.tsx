
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, ChevronRight, Calendar, Clock, MapPin, PhoneCall, User, ClipboardCheck, ChevronLeft, ChevronDown, ChevronUp, CheckCircle, Clock3 } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  prescription?: boolean;
}

interface Order {
  id: string;
  date: string;
  time: string;
  status: 'delivered' | 'processing' | 'canceled';
  items: OrderItem[];
  total: number;
  address?: string;
  paymentMethod?: string;
  deliveryPartner?: string;
  trackingUpdates?: {
    status: string;
    time: string;
    description: string;
  }[];
}

const OrderHistory = () => {
  useBackNavigation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD123456',
      date: '10 Apr 2025',
      time: '14:30',
      status: 'delivered',
      items: [
        { id: 'item1', name: 'Paracetamol 500mg', quantity: 2, price: 245 },
        { id: 'item2', name: 'Vitamin C 1000mg', quantity: 1, price: 550 },
        { id: 'item3', name: 'Bandage Roll', quantity: 1, price: 445, prescription: true }
      ],
      total: 1240,
      address: '123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001',
      paymentMethod: 'Online Payment (Credit Card)',
      deliveryPartner: 'Rahul S.',
      trackingUpdates: [
        { status: 'Delivered', time: '10 Apr 2025, 14:30', description: 'Order has been delivered' },
        { status: 'Out for delivery', time: '10 Apr 2025, 13:15', description: 'Order is out for delivery' },
        { status: 'Order packed', time: '10 Apr 2025, 11:30', description: 'Order has been packed and ready for pickup' },
        { status: 'Order confirmed', time: '10 Apr 2025, 09:45', description: 'Order has been confirmed' }
      ]
    },
    {
      id: 'ORD123455',
      date: '05 Apr 2025',
      time: '10:15',
      status: 'delivered',
      items: [
        { id: 'item4', name: 'Blood Glucose Test Strips', quantity: 1, price: 850 }
      ],
      total: 850,
      address: '123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001',
      paymentMethod: 'UPI Payment',
      deliveryPartner: 'Amit K.',
      trackingUpdates: [
        { status: 'Delivered', time: '05 Apr 2025, 10:15', description: 'Order has been delivered' },
        { status: 'Out for delivery', time: '05 Apr 2025, 09:20', description: 'Order is out for delivery' },
        { status: 'Order packed', time: '05 Apr 2025, 08:45', description: 'Order has been packed and ready for pickup' },
        { status: 'Order confirmed', time: '04 Apr 2025, 21:30', description: 'Order has been confirmed' }
      ]
    },
    {
      id: 'ORD123454',
      date: '28 Mar 2025',
      time: '16:45',
      status: 'canceled',
      items: [
        { id: 'item5', name: 'Thermometer', quantity: 1, price: 450 }
      ],
      total: 450,
      address: '123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001',
      paymentMethod: 'Buy Now Pay Later',
      trackingUpdates: [
        { status: 'Canceled', time: '28 Mar 2025, 16:45', description: 'Order has been canceled by user' },
        { status: 'Order confirmed', time: '28 Mar 2025, 15:30', description: 'Order has been confirmed' }
      ]
    },
    {
      id: 'ORD123453',
      date: '20 Mar 2025',
      time: '09:30',
      status: 'delivered',
      items: [
        { id: 'item6', name: 'First Aid Kit', quantity: 1, price: 650 },
        { id: 'item7', name: 'Hand Sanitizer', quantity: 2, price: 240 },
        { id: 'item8', name: 'Face Masks (Pack of 10)', quantity: 1, price: 350 },
        { id: 'item9', name: 'Antiseptic Solution', quantity: 1, price: 340 }
      ],
      total: 1580,
      address: '123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001',
      paymentMethod: 'Cash on Delivery',
      deliveryPartner: 'Suresh G.',
      trackingUpdates: [
        { status: 'Delivered', time: '20 Mar 2025, 09:30', description: 'Order has been delivered' },
        { status: 'Out for delivery', time: '20 Mar 2025, 08:15', description: 'Order is out for delivery' },
        { status: 'Order packed', time: '19 Mar 2025, 19:30', description: 'Order has been packed and ready for pickup' },
        { status: 'Order confirmed', time: '19 Mar 2025, 18:00', description: 'Order has been confirmed' }
      ]
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDialog(true);
  };
  
  const toggleExpandOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
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
                    <span className="text-white">{order.items.length}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">₹{order.total.toFixed(2)}</span>
                  </div>
                  
                  {expandedOrder === order.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-white/5 space-y-2"
                    >
                      <h4 className="text-white font-medium mb-2">Order Items</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-300">{item.name}</span>
                            {item.prescription && (
                              <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full">
                                Rx
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400">{item.quantity} x ₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                      
                      {order.paymentMethod && (
                        <div className="flex justify-between text-sm pt-2 border-t border-white/5 mt-2">
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-gray-300">{order.paymentMethod}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-gray-300 border-white/10 hover:bg-black/20"
                      onClick={() => toggleExpandOrder(order.id)}
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span>Hide Details</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span>Show Details</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-zepmeds-purple hover:bg-zepmeds-purple/10 flex items-center justify-center gap-1"
                      onClick={() => handleViewOrder(order)}
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </main>
      
      {/* Order Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-background border-white/10 max-w-md max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-zepmeds-purple" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">{selectedOrder.id}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)} capitalize`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{selectedOrder.date}, {selectedOrder.time}</span>
              </div>
              
              {selectedOrder.address && (
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Delivery Address</h4>
                      <p className="text-xs text-gray-300">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedOrder.deliveryPartner && (
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Delivery Partner</h4>
                      <p className="text-xs text-gray-300">{selectedOrder.deliveryPartner}</p>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs text-zepmeds-purple hover:bg-zepmeds-purple/10 p-0">
                        <PhoneCall className="h-3 w-3 mr-1" /> Contact
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-medium text-white mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <div className="flex items-center">
                          <span className="text-gray-300">{item.name}</span>
                          {item.prescription && (
                            <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-gray-300">₹{item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 mt-4 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-300">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Delivery Fee</span>
                    <span className="text-gray-300">₹0.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-white mt-3">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {selectedOrder.paymentMethod && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <span className="text-gray-400 text-sm">Payment Method:</span>
                    <span className="text-sm text-gray-300">{selectedOrder.paymentMethod}</span>
                  </div>
                )}
              </div>
              
              {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-white mb-3">Order Timeline</h4>
                  <div className="space-y-4">
                    {selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={index} className="relative pl-6">
                        {index !== selectedOrder.trackingUpdates!.length - 1 && (
                          <div className="absolute left-[9px] top-6 w-0.5 h-[calc(100%-12px)] bg-gray-700"></div>
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-1">
                            <div className={`absolute left-0 top-1 w-[18px] h-[18px] rounded-full flex items-center justify-center 
                              ${index === 0 ? 'bg-green-500' : 'bg-gray-700'}`}>
                              {index === 0 ? (
                                <CheckCircle className="h-3 w-3 text-black" />
                              ) : (
                                <Clock3 className="h-3 w-3 text-gray-300" />
                              )}
                            </div>
                            <h5 className={`text-sm font-medium ${index === 0 ? 'text-green-500' : 'text-gray-300'}`}>
                              {update.status}
                            </h5>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">{update.time}</div>
                          <p className="text-xs text-gray-400">{update.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  className="text-gray-300 border-white/10 hover:bg-black/20"
                  onClick={() => setShowDialog(false)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                
                {selectedOrder.status === 'delivered' && (
                  <Button 
                    variant="outline" 
                    className="text-zepmeds-purple border-zepmeds-purple hover:bg-zepmeds-purple/10"
                  >
                    <ClipboardCheck className="h-4 w-4 mr-1" /> Reorder
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderHistory;
