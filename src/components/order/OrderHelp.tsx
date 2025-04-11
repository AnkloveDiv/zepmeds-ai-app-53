
import OrderActions from "@/components/order/OrderActions";

interface OrderHelpProps {
  orderId: string;
}

const OrderHelp = ({ orderId }: OrderHelpProps) => {
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-white font-bold mb-4">Need Help?</h3>
      <OrderActions orderId={orderId} />
    </div>
  );
};

export default OrderHelp;
