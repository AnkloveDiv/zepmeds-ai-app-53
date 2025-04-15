
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Settings,
  RefreshCcw,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminDashboardOrders } from "@/services/orderService";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      const orderData = await getAdminDashboardOrders();
      setOrders(orderData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-white text-xl font-bold">ZepMeds Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-gray-700 text-gray-300"
            onClick={loadOrders}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="pt-20 pb-20 px-4">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="w-full mb-6 bg-black/40">
            <TabsTrigger value="orders" className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Order Management</h2>
              <Button variant="default" className="bg-zepmeds-purple hover:bg-zepmeds-purple/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-t-zepmeds-purple border-opacity-50 rounded-full animate-spin"></div>
              </div>
            ) : (
              <AdminOrdersTable orders={orders} onOrderUpdated={loadOrders} />
            )}
          </TabsContent>
          
          <TabsContent value="customers" className="mt-4">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Customer Management</h3>
              <p className="text-gray-400 mb-4">This feature is coming soon!</p>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <div className="text-center py-12">
              <BarChart className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400 mb-4">Insights and reporting coming soon!</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">System Settings</h3>
              <p className="text-gray-400 mb-4">Configuration options coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
