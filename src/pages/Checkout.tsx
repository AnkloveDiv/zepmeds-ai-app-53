
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  CreditCard, 
  Wallet, 
  Landmark, 
  ArrowRight, 
  Plus, 
  IndianRupee,
  CreditCard as CreditCardIcon,
  Calendar,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import useBackNavigation from "@/hooks/useBackNavigation";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showBNPLVerify, setShowBNPLVerify] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [bnplVerified, setBnplVerified] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: ""
  });
  
  // Use back navigation hook
  useBackNavigation();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const verifyPAN = () => {
    // Basic PAN validation (just checking format: ABCDE1234F)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!panRegex.test(panNumber)) {
      toast({
        title: "Invalid PAN format",
        description: "Please enter a valid PAN card number",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate verification
    toast({
      title: "PAN Verified Successfully",
      description: "You can now use Buy Now Pay Later option",
    });
    
    setBnplVerified(true);
    setShowBNPLVerify(false);
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

    // For BNPL, check if verified
    if (paymentMethod === "bnpl" && !bnplVerified) {
      toast({
        title: "Verification required",
        description: "Please verify your PAN card for Buy Now Pay Later",
        variant: "destructive"
      });
      setShowBNPLVerify(true);
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
      },
      estimatedDelivery: "30-45 minutes",
      paymentDetails: {
        subtotal: 760,
        deliveryFee: 40,
        taxes: 0,
        discount: 0,
        total: 800
      },
      trackingUpdates: [
        {
          status: "Order Confirmed",
          time: new Date().toISOString(),
          description: "Your order has been received and confirmed"
        }
      ]
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderDetails));
    
    // Clear cart
    localStorage.setItem("cart", "[]");
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order #${orderDetails.id} has been confirmed`,
    });
    
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
                  <CreditCardIcon size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Card / Debit / Credit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer">
                  <IndianRupee size={18} className="mr-2 text-zepmeds-purple" />
                  <span>UPI Payment</span>
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
                <RadioGroupItem value="bnpl" id="bnpl" />
                <Label htmlFor="bnpl" className="flex items-center cursor-pointer">
                  <Calendar size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Buy Now Pay Later</span>
                  {!bnplVerified && (
                    <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                      Verification Required
                    </span>
                  )}
                  {bnplVerified && (
                    <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
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
          
          {paymentMethod === "bnpl" && !bnplVerified && (
            <Button 
              onClick={() => setShowBNPLVerify(true)} 
              variant="outline" 
              className="mt-4 w-full border-zepmeds-purple text-zepmeds-purple"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify PAN for Buy Now Pay Later
            </Button>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-medium mb-3">Order Summary</h3>
          
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Items Subtotal</span>
            <span>₹760</span>
          </div>
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Taxes</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between text-white font-bold mt-4 pt-4 border-t border-white/10">
            <span>To Pay</span>
            <span>₹800</span>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-green-500">Secured Payment</p>
                <p className="text-xs text-green-400/70">All transactions are secured and encrypted</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <Button 
          className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light py-6 text-lg"
          onClick={handlePlaceOrder}
        >
          Place Order <ArrowRight className="ml-2" size={18} />
        </Button>
      </main>
      
      {/* BNPL PAN Verification Dialog */}
      <Dialog open={showBNPLVerify} onOpenChange={setShowBNPLVerify}>
        <DialogContent className="bg-background border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">PAN Card Verification</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                <p className="text-sm text-gray-300">
                  Buy Now Pay Later requires PAN verification
                </p>
              </div>
              
              <Label htmlFor="pan">PAN Card Number</Label>
              <Input
                id="pan"
                placeholder="Enter PAN (e.g. ABCDE1234F)"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="bg-black/20 border-white/10"
                maxLength={10}
              />
              <p className="text-xs text-gray-400">Your PAN details are secure and only used for verification</p>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowBNPLVerify(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-zepmeds-purple hover:bg-zepmeds-purple-light"
                onClick={verifyPAN}
              >
                Verify PAN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
