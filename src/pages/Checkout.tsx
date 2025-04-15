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
import { 
  MapPin, CreditCard, Clock, Truck, Wallet, Tag, 
  Plus, Check, Calendar, DollarSign, Server, Shield,
  Smartphone, IndianRupee
} from "lucide-react";
import useBackNavigation from "@/hooks/useBackNavigation";
import OrderForSomeoneElse from "@/components/checkout/OrderForSomeoneElse";
import DateTimePicker from "@/components/checkout/DateTimePicker";

const UPI_PROVIDERS = [
  { id: "googlepay", name: "Google Pay", iconBg: "bg-blue-500" },
  { id: "phonepe", name: "PhonePe", iconBg: "bg-purple-600" },
  { id: "paytm", name: "Paytm", iconBg: "bg-blue-400" },
  { id: "amazonpay", name: "Amazon Pay", iconBg: "bg-orange-500" },
  { id: "mobikwik", name: "MobiKwik", iconBg: "bg-red-500" },
  { id: "fampay", name: "FamPay", iconBg: "bg-yellow-500" },
];

const BNPL_PROVIDERS = [
  { id: "simpl", name: "Simpl", iconBg: "bg-indigo-600" },
  { id: "lazypay", name: "LazyPay", iconBg: "bg-green-600" },
  { id: "zestmoney", name: "ZestMoney", iconBg: "bg-teal-500" },
  { id: "kredpay", name: "KredPay", iconBg: "bg-red-600" },
];

// Valid coupon codes with their discount logic
const VALID_COUPONS = [
  { code: "WELCOME10", discount: 10, type: "percent", maxDiscount: 100 },
  { code: "FLAT50", discount: 50, type: "flat" },
  { code: "ZEPMEDS20", discount: 20, type: "percent", maxDiscount: 200 },
  { code: "TESTING", discount: 0, type: "flat" } // For testing purposes
];

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
  const [upiProvider, setUpiProvider] = useState("");
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
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showBnplDetails, setShowBnplDetails] = useState(false);
  const [showUpiDetails, setShowUpiDetails] = useState(false);
  
  // State for scheduled delivery
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  
  const [bnplProvider, setBnplProvider] = useState("simpl");
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      const total = parsedCart.reduce((acc: number, item: any) => {
        const itemPrice = item.discountPrice || item.price;
        return acc + (itemPrice * (item.quantity || 1));
      }, 0);
      
      setSubTotal(total);
      
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } else {
      navigate("/cart");
    }
  }, []);
  
  useEffect(() => {
    if (paymentMethod !== "card") {
      setShowCardDetails(false);
    }
    
    if (paymentMethod !== "bnpl") {
      setShowBnplDetails(false);
    }
    
    if (paymentMethod !== "upi") {
      setShowUpiDetails(false);
    }
  }, [paymentMethod]);
  
  // Reset scheduled delivery details when changing delivery time
  useEffect(() => {
    if (deliveryTime !== "scheduled") {
      setScheduledDate(undefined);
      setScheduledTime("");
    }
  }, [deliveryTime]);
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive"
      });
      return;
    }
    
    const coupon = VALID_COUPONS.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      let discountAmount = 0;
      
      if (coupon.type === "percent") {
        discountAmount = Math.floor((subTotal * coupon.discount) / 100);
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
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
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
    
    if (deliveryTime === "scheduled" && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Delivery time required",
        description: "Please select a date and time for scheduled delivery.",
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardName) {
        toast({
          title: "Card name required",
          description: "Please enter the name on your card.",
          variant: "destructive"
        });
        return;
      }
      
      if (cardExpiry.length !== 5) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date in MM/YY format.",
          variant: "destructive"
        });
        return;
      }
      
      if (cardCvv.length !== 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV number.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (paymentMethod === "bnpl" && !bnplProvider) {
      toast({
        title: "BNPL provider required",
        description: "Please select a Buy Now Pay Later provider.",
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === "upi" && !upiProvider) {
      toast({
        title: "UPI provider required",
        description: "Please select a UPI payment method.",
        variant: "destructive"
      });
      return;
    }
    
    const total = subTotal + deliveryFee - discount - couponDiscount - (useWallet ? walletBalance : 0);
    
    if (total < 0) {
      toast({
        title: "Invalid amount",
        description: "The total amount cannot be negative. Please adjust your payment options.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate delivery details based on delivery time choice
    let estimatedDelivery;
    let deliveryDetails;
    
    if (deliveryTime === "express") {
      estimatedDelivery = new Date(Date.now() + 15 * 60000).toISOString();
      deliveryDetails = { type: "express", eta: "15 minutes" };
    } else if (deliveryTime === "standard") {
      estimatedDelivery = new Date(Date.now() + 120 * 60000).toISOString();
      deliveryDetails = { type: "standard", eta: "2 hours" };
    } else if (deliveryTime === "scheduled") {
      // Combine the scheduled date and time
      if (scheduledDate && scheduledTime) {
        // Parse time from format like "10:00 AM"
        const [hourMinute, period] = scheduledTime.split(' ');
        const [hour, minute] = hourMinute.split(':').map(Number);
        
        // Convert to 24-hour format
        let hour24 = hour;
        if (period.toUpperCase() === 'PM' && hour !== 12) {
          hour24 += 12;
        } else if (period.toUpperCase() === 'AM' && hour === 12) {
          hour24 = 0;
        }
        
        // Create a new date object with scheduled date and time
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(hour24, minute, 0, 0);
        
        estimatedDelivery = scheduledDateTime.toISOString();
        deliveryDetails = { 
          type: "scheduled", 
          scheduledDate: scheduledDate.toISOString(),
          scheduledTime: scheduledTime
        };
      }
    }
    
    const orderId = `ZM${Math.floor(Math.random() * 10000)}`;
    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
    
    const order = {
      id: orderId,
      items: cartItems,
      subTotal,
      deliveryFee,
      discount,
      couponDiscount,
      walletAmountUsed: useWallet ? Math.min(walletBalance, Math.max(0, total)) : 0,
      total: Math.max(0, total),
      paymentMethod,
      paymentDetails: paymentMethod === "card" ? {
        cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
        cardName,
        cardExpiry
      } : (paymentMethod === "bnpl" ? { provider: bnplProvider } : 
           paymentMethod === "upi" ? { provider: upiProvider } : null),
      address: selectedAddressData,
      deliveryTime,
      deliveryDetails,
      status: "confirmed",
      placedAt: new Date().toISOString(),
      estimatedDelivery,
      deliveryRider: {
        name: "Rahul Singh",
        rating: 4.8,
        phone: "+91 98765 43210",
        eta: deliveryTime === "express" ? "15 minutes" : (deliveryTime === "standard" ? "2 hours" : "As scheduled")
      },
    };
    
    localStorage.setItem("currentOrder", JSON.stringify(order));
    localStorage.setItem("cart", JSON.stringify([]));
    
    // Send order to admin dashboard
    try {
      import('./dashboardApiService').then(({ getDashboardApiService, OrderDataPayload }) => {
        const dashboardApi = getDashboardApiService();
        
        // Format data for dashboard
        const dashboardOrderData: OrderDataPayload = {
          orderId: order.id,
          orderNumber: order.id,
          customerInfo: {
            name: recipientDetails ? recipientDetails.name : user?.name || "Guest Customer",
            phone: recipientDetails ? recipientDetails.phone : user?.phoneNumber || "Not provided",
            address: selectedAddressData ? `${selectedAddressData.address}, ${selectedAddressData.city}, ${selectedAddressData.state}` : "Address not provided"
          },
          items: cartItems.map(item => ({
            id: item.id || `item-${Math.random().toString(36).substring(2, 9)}`,
            name: item.name,
            quantity: item.quantity || 1,
            price: item.discountPrice || item.price
          })),
          status: "confirmed",
          totalAmount: order.total,
          paymentMethod: order.paymentMethod,
          createdAt: order.placedAt
        };
        
        console.log("Sending order to admin dashboard:", dashboardOrderData);
        dashboardApi.sendOrderData(dashboardOrderData).then(response => {
          console.log("Order successfully sent to admin dashboard:", response);
        }).catch(error => {
          console.error("Failed to send order to admin dashboard:", error);
        });
      }).catch(err => {
        console.error("Failed to load dashboard API service:", err);
      });
    } catch (err) {
      console.error("Error sending order to admin dashboard:", err);
    }
    
    toast({
      title: "Order placed successfully!",
      description: `Your order #${order.id} has been placed successfully.`,
    });
    
    navigate(`/track-order/${order.id}`);
  };
  
  // Calculate totals - ensure we're using proper number values
  const subTotalAmount = parseFloat(subTotal.toString()) || 0;
  const deliveryFeeAmount = parseFloat(deliveryFee.toString()) || 0;
  const discountAmount = parseFloat(discount.toString()) || 0;
  const couponDiscountAmount = parseFloat(couponDiscount.toString()) || 0;
  
  const totalAmount = subTotalAmount + deliveryFeeAmount - discountAmount - couponDiscountAmount;
  const walletAmountToUse = useWallet ? Math.min(walletBalance, totalAmount) : 0;
  const finalAmount = Math.max(0, totalAmount - walletAmountToUse);
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Checkout" />
      <ExitConfirmDialog />
      
      <div className="fixed bottom-20 left-0 right-0 p-4 glass-morphism border-t border-white/10 backdrop-blur-lg z-20 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-white text-xl font-bold">₹{finalAmount.toFixed(2)}</p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 shadow-md"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
      
      <div className="fixed top-16 right-4 z-20">
        <div className="bg-gradient-to-r from-green-500 to-teal-400 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-white text-sm font-bold">₹{finalAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <main className="px-4 py-4 space-y-6 mb-20">
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-400" size={20} />
            Delivery Address
          </h2>
          <RadioGroup 
            value={selectedAddress?.toString() || ""} 
            onValueChange={(value) => setSelectedAddress(parseInt(value))}
            className="space-y-3"
          >
            {addresses.map(address => (
              <div 
                key={address.id}
                className={`p-4 rounded-xl transition-all ${
                  selectedAddress === address.id 
                    ? "border-blue-500 glass-morphism shadow-md" 
                    : "border-gray-700 bg-black/40"
                }`}
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <RadioGroupItem 
                        value={address.id.toString()} 
                        id={`address-${address.id}`} 
                        className="text-blue-400"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-white font-medium">{address.type}</h3>
                        {address.isDefault && (
                          <Badge variant="outline" className="ml-2 text-xs px-2 py-0 h-5 bg-green-900/30 text-green-400 border-green-800">
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
            className="mt-3 text-blue-400 border-blue-800 hover:bg-blue-900/30"
            onClick={() => navigate("/addresses")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <Truck className="mr-2 text-green-400" size={20} />
            Delivery Time
          </h2>
          <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime} className="space-y-3">
            <div className={`p-4 rounded-xl transition-all ${
              deliveryTime === "express" 
                ? "border-green-500 bg-green-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="express" id="express" className="text-green-400 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="express" className="text-white font-medium">Express Delivery</Label>
                    <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900/50 border-0">₹50</Badge>
                  </div>
                  <p className="text-green-400 text-sm font-medium">Delivered within 15 minutes</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl transition-all ${
              deliveryTime === "standard" 
                ? "border-orange-500 bg-orange-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="standard" id="standard" className="text-orange-400 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="standard" className="text-white font-medium">Standard Delivery</Label>
                    <Badge className="bg-blue-900/50 text-blue-400 hover:bg-blue-900/50 border-0">FREE</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Delivered within 2 hours</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl transition-all ${
              deliveryTime === "scheduled" 
                ? "border-purple-500 bg-purple-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="flex items-start">
                <RadioGroupItem value="scheduled" id="scheduled" className="text-purple-400 mt-1 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label htmlFor="scheduled" className="text-white font-medium">Scheduled Delivery</Label>
                    <Badge className="bg-blue-900/50 text-blue-400 hover:bg-blue-900/50 border-0">FREE</Badge>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1 text-purple-400" />
                    <span>Choose your preferred delivery slot</span>
                  </div>
                </div>
              </div>
              
              {deliveryTime === "scheduled" && (
                <div className="mt-4 ml-8">
                  <DateTimePicker
                    selectedDate={scheduledDate}
                    onDateChange={setScheduledDate}
                    selectedTime={scheduledTime}
                    onTimeChange={setScheduledTime}
                  />
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <Tag className="mr-2 text-pink-400" size={20} />
            Apply Coupon
          </h2>
          
          {appliedCoupon ? (
            <div className="p-4 rounded-xl border border-pink-800 bg-pink-900/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-pink-400 mr-2" />
                  <div>
                    <h3 className="text-white font-medium">{appliedCoupon}</h3>
                    <p className="text-green-400 text-sm">₹{couponDiscount.toFixed(2)} saved</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 h-8 hover:bg-red-900/30"
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
                className="bg-black/40 border-gray-700 text-white"
              />
              <Button 
                variant="outline" 
                className="text-pink-400 border-pink-800 hover:bg-pink-900/30"
                onClick={handleApplyCoupon}
              >
                Apply
              </Button>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-400">
            <p>Try coupon codes: WELCOME10, FLAT50, ZEPMEDS20</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <Wallet className="mr-2 text-green-400" size={20} />
            ZepMeds Wallet
          </h2>
          <div className="p-4 rounded-xl border border-green-800 bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <h3 className="text-white font-medium">Available Balance</h3>
                  <p className="text-green-400 font-bold">₹{walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Label htmlFor="use-wallet" className="mr-2 text-gray-400">Use wallet</Label>
                <input
                  type="checkbox"
                  id="use-wallet"
                  checked={useWallet}
                  onChange={handleToggleWallet}
                  className="h-5 w-5 rounded border-gray-700 bg-black/40 checked:bg-green-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <OrderForSomeoneElse onChange={handleRecipientDetailsChange} />
        
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <CreditCard className="mr-2 text-blue-400" size={20} />
            Payment Method
          </h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div className={`p-4 rounded-xl transition-all ${
              paymentMethod === "cod" 
                ? "border-orange-500 bg-orange-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="flex items-center">
                <RadioGroupItem value="cod" id="cod" className="text-orange-400 mr-3" />
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-orange-400 mr-2" />
                  <Label htmlFor="cod" className="text-white font-medium">Cash on Delivery</Label>
                </div>
              </div>
            </div>
            
            <div className={`rounded-xl transition-all ${
              paymentMethod === "card" 
                ? "border-blue-500 bg-blue-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="p-4" onClick={() => {
                setPaymentMethod("card");
                setShowCardDetails(true);
              }}>
                <div className="flex items-center">
                  <RadioGroupItem value="card" id="card" className="text-blue-400 mr-3" />
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-400 mr-2" />
                    <Label htmlFor="card" className="text-white font-medium">Credit / Debit Card</Label>
                  </div>
                </div>
              </div>
              
              {paymentMethod === "card" && showCardDetails && (
                <div className="p-4 pt-0 space-y-3">
                  <Separator className="bg-blue-800/50 my-3" />
                  
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-400 text-sm">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="bg-black/40 border-gray-700 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName" className="text-gray-400 text-sm">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-black/40 border-gray-700 text-white mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="cardExpiry" className="text-gray-400 text-sm">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className="bg-black/40 border-gray-700 text-white mt-1"
                      />
                    </div>
                    
                    <div className="w-1/3">
                      <Label htmlFor="cardCvv" className="text-gray-400 text-sm">CVV</Label>
                      <Input
                        id="cardCvv"
                        type="password"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        maxLength={3}
                        className="bg-black/40 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`rounded-xl transition-all ${
              paymentMethod === "upi" 
                ? "border-green-500 bg-green-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="p-4" onClick={() => {
                setPaymentMethod("upi");
                setShowUpiDetails(true);
              }}>
                <div className="flex items-center">
                  <RadioGroupItem value="upi" id="upi" className="text-green-400 mr-3" />
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-green-400 mr-2" />
                    <Label htmlFor="upi" className="text-white font-medium">UPI / Mobile Payments</Label>
                  </div>
                </div>
              </div>
              
              {paymentMethod === "upi" && showUpiDetails && (
                <div className="p-4 pt-0">
                  <Separator className="bg-green-800/50 my-3" />
                  
                  <RadioGroup value={upiProvider} onValueChange={setUpiProvider} className="grid grid-cols-2 gap-2">
                    {UPI_PROVIDERS.map(provider => (
                      <div 
                        key={provider.id}
                        className={`p-3 rounded-lg transition-all ${
                          upiProvider === provider.id 
                            ? "border-green-500 bg-green-900/40" 
                            : "border-gray-700 bg-black/40"
                        }`}
                      >
                        <RadioGroupItem 
                          value={provider.id} 
                          id={`upi-${provider.id}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`upi-${provider.id}`}
                          className="flex items-center cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-full ${provider.iconBg} flex items-center justify-center mr-2`}>
                            <IndianRupee className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white text-sm">{provider.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-green-900/20 border border-green-800/50">
                    <Smartphone className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-gray-400">You'll be redirected to complete the payment</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`rounded-xl transition-all ${
              paymentMethod === "bnpl" 
                ? "border-amber-500 bg-amber-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="p-4" onClick={() => {
                setPaymentMethod("bnpl");
                setShowBnplDetails(true);
              }}>
                <div className="flex items-center">
                  <RadioGroupItem value="bnpl" id="bnpl" className="text-amber-400 mr-3" />
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-400 mr-2" />
                    <Label htmlFor="bnpl" className="text-white font-medium">Buy Now, Pay Later</Label>
                  </div>
                </div>
              </div>
              
              {paymentMethod === "bnpl" && showBnplDetails && (
                <div className="p-4 pt-0">
                  <Separator className="bg-amber-800/50 my-3" />
                  
                  <RadioGroup value={bnplProvider} onValueChange={setBnplProvider} className="grid grid-cols-2 gap-2">
                    {BNPL_PROVIDERS.map(provider => (
                      <div 
                        key={provider.id}
                        className={`p-3 rounded-lg transition-all ${
                          bnplProvider === provider.id 
                            ? "border-amber-500 bg-amber-900/40" 
                            : "border-gray-700 bg-black/40"
                        }`}
                      >
                        <RadioGroupItem 
                          value={provider.id} 
                          id={`bnpl-${provider.id}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`bnpl-${provider.id}`}
                          className="flex items-center cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-full ${provider.iconBg} flex items-center justify-center mr-2`}>
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white text-sm">{provider.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-amber-900/20 border border-amber-800/50">
                    <Server className="h-4 w-4 text-amber-400" />
                    <span className="text-xs text-gray-400">Complete authentication to use BNPL service</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-4 rounded-xl transition-all ${
              paymentMethod === "online" 
                ? "border-purple-500 bg-purple-900/30" 
                : "border-gray-700 bg-black/40"
            }`}>
              <div className="flex items-center">
                <RadioGroupItem value="online" id="online" className="text-purple-400 mr-3" />
                <div className="flex items-center">
                  <Server className="h-5 w-5 text-purple-400 mr-2" />
                  <Label htmlFor="online" className="text-white font-medium">Other Payment Methods</Label>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <DollarSign className="mr-2 text-purple-400" size={20} />
            Order Summary
          </h2>
          <div className="p-4 rounded-xl border border-gray-700 bg-black/40 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{subTotalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span>{deliveryFeeAmount > 0 ? `₹${deliveryFeeAmount.toFixed(2)}` : "FREE"}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator className="bg-gray-700 my-2" />
              
              <div className="flex justify-between text-white font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              {useWallet && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Wallet Amount</span>
                    <span>-₹{walletAmountToUse.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="bg-gray-700 my-2" />
                  
                  <div className="flex justify-between text-white font-bold">
                    <span>To Pay</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Checkout;
