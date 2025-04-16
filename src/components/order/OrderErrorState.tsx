
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

const OrderErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton title="Track Order" />
      
      <main className="px-4 py-8 text-center">
        <div className="glass-morphism rounded-xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Info className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Order Not Found</h3>
          <p className="text-gray-400 mb-6">We couldn't find the order you're looking for. It may have been cancelled or removed.</p>
          
          <Button
            className="bg-zepmeds-purple hover:bg-zepmeds-purple/90 w-full"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderErrorState;
