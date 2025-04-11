
import { Package, FileText, HelpCircle, AlertTriangle } from "lucide-react";

interface OrderInfoProps {
  totalItems: number;
}

const OrderInfo = ({ totalItems }: OrderInfoProps) => {
  return (
    <div className="bg-black/20 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Package className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-white font-medium">Order Items: {totalItems}</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-green-500 flex items-center text-xs bg-green-500/10 px-2 py-1 rounded-full">
            <FileText className="h-3 w-3 mr-1" />
            Invoice
          </button>
          <button className="text-amber-500 flex items-center text-xs bg-amber-500/10 px-2 py-1 rounded-full">
            <HelpCircle className="h-3 w-3 mr-1" />
            Help
          </button>
          <button className="text-red-500 flex items-center text-xs bg-red-500/10 px-2 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
