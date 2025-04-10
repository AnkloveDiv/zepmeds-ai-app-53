
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, CreditCard, Wallet, Landmark, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: ""
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate form
    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || 
        !deliveryAddress.city || !deliveryAddress.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save order details (in a real app, this would be an API call)
    const orderDetails = {
      id: `ORD${Math.floor(Math.random() * 10000)}`,
      paymentMethod,
      deliveryAddress,
      items: JSON.parse(localStorage.getItem("cart") || "[]"),
      status: "confirmed",
      timestamp: new Date().toISOString(),
      deliveryRider: {
        name: "Rahul Kumar",
        rating: 4.8,
        phone: "+91 9876543210",
        eta: "15 minutes"
      }
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderDetails));
    
    // Clear cart
    localStorage.setItem("cart", "[]");
    
    // Navigate to tracking page
    navigate("/order-tracking");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header showBackButton title="Checkout" />
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MapPin className="text-zepmeds-purple mr-2" size={20} />
              <h3 className="text-white font-medium">Delivery Address</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-zepmeds-purple">
              <Plus size={16} className="mr-1" /> New
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={deliveryAddress.fullName}
                  onChange={handleAddressChange}
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={deliveryAddress.phone}
                  onChange={handleAddressChange}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={deliveryAddress.address}
                onChange={handleAddressChange}
                className="bg-black/20 border-white/10"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={deliveryAddress.pincode}
                  onChange={handleAddressChange}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                name="landmark"
                value={deliveryAddress.landmark}
                onChange={handleAddressChange}
                className="bg-black/20 border-white/10"
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-medium mb-4">Payment Method</h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex items-center cursor-pointer">
                  <CreditCard size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Card / UPI / Net Banking</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Wallet</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center cursor-pointer">
                  <Landmark size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-medium mb-3">Order Summary</h3>
          
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Order Total</span>
            <span>₹760</span>
          </div>
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>
          <div className="flex justify-between text-white font-bold mt-4 pt-4 border-t border-white/10">
            <span>To Pay</span>
            <span>₹800</span>
          </div>
        </motion.div>
        
        <Button 
          className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light py-6 text-lg"
          onClick={handlePlaceOrder}
        >
          Place Order <ArrowRight className="ml-2" size={18} />
        </Button>
      </main>
    </div>
  );
};

export default Checkout;
