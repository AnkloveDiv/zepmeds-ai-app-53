
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, CreditCard, Clock, Truck, Wallet, Tag, Plus, Check, Calendar } from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";
import OrderForSomeoneElse from "@/components/checkout/OrderForSomeoneElse";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ExitConfirmDialog } = useBackNavigation();
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(500);
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Apartment 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Ave, Suite 200",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("express");
  const [recipientDetails, setRecipientDetails] = useState<any>(null);
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      // Calculate subtotal
      const total = parsedCart.reduce((acc: number, item: any) => {
        const itemPrice = item.discountPrice || item.price;
        return acc + (itemPrice * item.quantity);
      }, 0);
      
      setSubTotal(total);
      
      // Find default address
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } else {
      navigate("/cart");
    }
  }, []);
  
  const handleApplyCoupon = () => {
    // Mock coupon codes
    const validCoupons = [
      { code: "WELCOME10", discount: 10, type: "percent", maxDiscount: 100 },
      { code: "FLAT50", discount: 50, type: "flat" },
      { code: "ZEPMEDS20", discount: 20, type: "percent", maxDiscount: 200 }
    ];
    
    const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      let discountAmount = 0;
      
      if (coupon.type === "percent") {
        discountAmount = (subTotal * coupon.discount) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discount;
      }
      
      setCouponDiscount(discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      
      toast({
        title: "Coupon applied",
        description: `Coupon ${couponCode.toUpperCase()} applied successfully!`,
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon("");
    setCouponCode("");
    
    toast({
      title: "Coupon removed",
      description: "Coupon has been removed successfully.",
    });
  };
  
  const handleToggleWallet = () => {
    setUseWallet(!useWallet);
  };
  
  const handleRecipientDetailsChange = (details: any) => {
    setRecipientDetails(details);
  };
  
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast({
        title: "Address required",
        description: "Please select a delivery address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate total after all discounts
    const total = subTotal + deliveryFee - discount - couponDiscount - (useWallet ? walletBalance : 0);
    
    if (total < 0) {
      toast({
        title: "Invalid amount",
        description: "The total amount cannot be negative. Please adjust your payment options.",
        variant: "destructive"
      });
      return;
    }
    
    // Create order object
    const order = {
      id: `ZM${Math.floor(Math.random() * 10000)}`,
      items: cartItems,
      subTotal,
      deliveryFee,
      discount,
      couponDiscount,
      walletAmountUsed: useWallet ? walletBalance : 0,
      total: Math.max(0, total),
      paymentMethod,
      address: addresses.find(addr => addr.id === selectedAddress),
      deliveryTime,
      status: "confirmed",
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + (deliveryTime === "express" ? 30 : 120) * 60000).toISOString()
    };
    
    // Save order in localStorage
    localStorage.setItem("currentOrder", JSON.stringify(order));
    
    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]));
    
    // Show success message
    toast({
      title: "Order placed successfully!",
      description: `Your order #${order.id} has been placed successfully.`,
    });
    
    // Navigate to tracking page
    navigate(`/track-order/${order.id}`);
  };
  
  const totalAmount = subTotal + deliveryFee - discount - couponDiscount;
  const finalAmount = Math.max(0, totalAmount - (useWallet ? walletBalance : 0));
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Checkout" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-4 space-y-6">
        {/* Delivery Address */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Delivery Address</h2>
          <RadioGroup 
            value={selectedAddress?.toString() || ""} 
            onValueChange={(value) => setSelectedAddress(parseInt(value))}
            className="space-y-3"
          >
            {addresses.map(address => (
              <div 
                key={address.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedAddress === address.id 
                    ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                    : "border-white/10 bg-black/20"
                }`}
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <RadioGroupItem 
                        value={address.id.toString()} 
                        id={`address-${address.id}`} 
                        className="text-zepmeds-purple border-white/20"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-white font-medium">{address.type}</h3>
                        {address.isDefault && (
                          <Badge variant="outline" className="ml-2 text-xs px-2 py-0 h-5 bg-white/5">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{address.address}</p>
                      <p className="text-gray-400 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 text-zepmeds-purple border-zepmeds-purple"
            onClick={() => navigate("/addresses")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
        
        {/* Delivery Time */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Delivery Time</h2>
          <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime} className="space-y-3">
            <div className={`p-4 rounded-xl border transition-all ${
              deliveryTime === "express" 
                ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                : "border-white/10 bg-black/20"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="express" id="express" className="text-zepmeds-purple border-white/20 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="express" className="text-white font-medium">Express Delivery</Label>
                    <Badge className="bg-zepmeds-purple">₹50</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Delivered within 30 minutes</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl border transition-all ${
              deliveryTime === "standard" 
                ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                : "border-white/10 bg-black/20"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="standard" id="standard" className="text-zepmeds-purple border-white/20 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="standard" className="text-white font-medium">Standard Delivery</Label>
                    <Badge className="bg-green-600">FREE</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Delivered within 2 hours</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl border transition-all ${
              deliveryTime === "scheduled" 
                ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                : "border-white/10 bg-black/20"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="scheduled" id="scheduled" className="text-zepmeds-purple border-white/20 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="scheduled" className="text-white font-medium">Scheduled Delivery</Label>
                    <Badge className="bg-green-600">FREE</Badge>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Select time slot</span>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Apply Coupon */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Apply Coupon</h2>
          
          {appliedCoupon ? (
            <div className="p-4 rounded-xl border border-zepmeds-purple bg-zepmeds-purple/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-zepmeds-purple mr-2" />
                  <div>
                    <h3 className="text-white font-medium">{appliedCoupon}</h3>
                    <p className="text-green-400 text-sm">₹{couponDiscount} saved</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zepmeds-purple h-8"
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input 
                placeholder="Enter coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
              <Button 
                variant="outline" 
                className="text-zepmeds-purple border-zepmeds-purple"
                onClick={handleApplyCoupon}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
        
        {/* Wallet */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">ZepMeds Wallet</h2>
          <div className="p-4 rounded-xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <h3 className="text-white font-medium">Available Balance</h3>
                  <p className="text-green-400 font-bold">₹{walletBalance}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Label htmlFor="use-wallet" className="mr-2 text-gray-300">Use wallet</Label>
                <input
                  type="checkbox"
                  id="use-wallet"
                  checked={useWallet}
                  onChange={handleToggleWallet}
                  className="h-5 w-5 rounded border-white/10 bg-black/20 checked:bg-zepmeds-purple"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Order for Someone Else */}
        <OrderForSomeoneElse onChange={handleRecipientDetailsChange} />
        
        {/* Payment Method */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
          <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod} className="space-y-3">
            <div className={`p-4 rounded-xl border transition-all ${
              paymentMethod === "cod" 
                ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                : "border-white/10 bg-black/20"
            }`}>
              <div className="flex items-center">
                <RadioGroupItem value="cod" id="cod" className="text-zepmeds-purple border-white/20 mr-3" />
                <Label htmlFor="cod" className="text-white font-medium">Cash on Delivery</Label>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl border transition-all ${
              paymentMethod === "online" 
                ? "border-zepmeds-purple bg-zepmeds-purple/10" 
                : "border-white/10 bg-black/20"
            }`}>
              <div className="flex items-center">
                <RadioGroupItem value="online" id="online" className="text-zepmeds-purple border-white/20 mr-3" />
                <Label htmlFor="online" className="text-white font-medium">Online Payment</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
          <div className="p-4 rounded-xl border border-white/10 bg-black/20">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee</span>
                <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "FREE"}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator className="bg-white/10 my-2" />
              
              <div className="flex justify-between text-white font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              {useWallet && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Wallet Amount</span>
                    <span>-₹{Math.min(walletBalance, totalAmount).toFixed(2)}</span>
                  </div>
                  
                  <Separator className="bg-white/10 my-2" />
                  
                  <div className="flex justify-between text-white font-bold">
                    <span>To Pay</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Place Order Button */}
        <Button 
          className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90 text-white py-6 text-lg"
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Checkout;
