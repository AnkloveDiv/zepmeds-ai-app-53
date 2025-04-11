
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const OrderLoadingState = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Package className="h-10 w-10 text-zepmeds-purple" />
          </motion.div>
        </div>
        <p className="text-white">Loading order details...</p>
      </div>
    </div>
  );
};

export default OrderLoadingState;
