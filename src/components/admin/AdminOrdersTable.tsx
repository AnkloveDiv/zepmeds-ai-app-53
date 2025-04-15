
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/services/orderService";

interface AdminOrdersTableProps {
  orders: any[];
  onOrderUpdated?: () => void;
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({ orders, onOrderUpdated }) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Status updated",
        description: `Order status updated to ${newStatus}`,
      });
      
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed: "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30",
      preparing: "bg-amber-900/20 text-amber-400 hover:bg-amber-900/30",
      "rider-assigned": "bg-purple-900/20 text-purple-400 hover:bg-purple-900/30",
      "in-transit": "bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30",
      delivered: "bg-green-900/20 text-green-400 hover:bg-green-900/30",
      cancelled: "bg-red-900/20 text-red-400 hover:bg-red-900/30",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || "bg-gray-800 text-gray-400"}>
        {status}
      </Badge>
    );
  };

  const getNextStatuses = (currentStatus: string) => {
    const statusFlow = {
      confirmed: ["preparing", "cancelled"],
      preparing: ["rider-assigned", "cancelled"],
      "rider-assigned": ["in-transit", "cancelled"],
      "in-transit": ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  return (
    <div className="w-full overflow-auto rounded-md border border-gray-700">
      <Table>
        <TableCaption>List of recent orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Order #</TableHead>
            <TableHead className="text-gray-300">Customer</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                No orders found. Create an order on the main app to see it here.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-white">
                  {order.order_number}
                </TableCell>
                <TableCell>
                  <div className="text-white">{order.customer_name}</div>
                  <div className="text-gray-400 text-sm">{order.customer_address}</div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(order.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-green-400">
                  ₹{parseFloat(order.total_amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {getNextStatuses(order.status).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant="outline"
                        className={
                          status === "cancelled"
                            ? "border-red-800 text-red-400 hover:bg-red-900/30"
                            : "border-green-800 text-green-400 hover:bg-green-900/30"
                        }
                        onClick={() => handleUpdateStatus(order.order_id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrdersTable;
