
interface OrderItemProps {
  items: any[];
}

const OrderItems = ({ items }: OrderItemProps) => {
  return (
    <div className="mb-6 glass-morphism rounded-xl p-4">
      <h3 className="text-white font-bold mb-2">Order Items</h3>
      
      <div className="space-y-3 mt-4">
        {items && items.map((item: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
              <img
                src={item.image || "https://source.unsplash.com/random/100x100/?medicine"}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://source.unsplash.com/random/100x100/?medicine";
                }}
              />
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-white">{item.name}</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Qty: {item.quantity}</span>
                <span className="text-white">₹{item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
