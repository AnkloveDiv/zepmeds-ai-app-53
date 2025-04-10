
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stripQuantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const updateStripQuantity = (id: string, newStripQuantity: number) => {
    if (newStripQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, stripQuantity: newStripQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + (itemPrice * item.quantity * item.stripQuantity);
    }, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Your Cart" />
      
      <main className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-zepmeds-purple border-t-transparent rounded-full"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-medium text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Add some medicines to your cart</p>
            <Button 
              className="bg-zepmeds-purple hover:bg-zepmeds-purple-light"
              onClick={() => navigate("/medicine-delivery")}
            >
              Browse Medicines
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism rounded-xl p-4 flex items-start"
                >
                  <div className="h-16 w-16 rounded-lg overflow-hidden mr-3">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <button 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-1">
                      {item.discountPrice ? (
                        <div className="flex items-center">
                          <span className="text-zepmeds-purple font-bold">₹{item.discountPrice}</span>
                          <span className="ml-2 text-gray-400 text-sm line-through">₹{item.price}</span>
                        </div>
                      ) : (
                        <span className="text-zepmeds-purple font-bold">₹{item.price}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                        <div className="flex items-center">
                          <button 
                            className="h-7 w-7 rounded-full bg-black/20 flex items-center justify-center text-white"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 text-white">{item.quantity}</span>
                          <button 
                            className="h-7 w-7 rounded-full bg-black/20 flex items-center justify-center text-white"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Strips</label>
                        <div className="flex items-center">
                          <button 
                            className="h-7 w-7 rounded-full bg-black/20 flex items-center justify-center text-white"
                            onClick={() => updateStripQuantity(item.id, item.stripQuantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 text-white">{item.stripQuantity}</span>
                          <button 
                            className="h-7 w-7 rounded-full bg-black/20 flex items-center justify-center text-white"
                            onClick={() => updateStripQuantity(item.id, item.stripQuantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="glass-morphism rounded-xl p-4 mb-6">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between text-white font-bold mt-4 pt-4 border-t border-white/10">
                <span>Total</span>
                <span>₹{calculateTotal() + 40}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light py-6 text-lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout <ArrowRight className="ml-2" size={18} />
            </Button>
          </>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Cart;
