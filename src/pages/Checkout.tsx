import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import OrderForSomeoneElse from "@/components/checkout/OrderForSomeoneElse";
import DateTimePicker from "@/components/checkout/DateTimePicker";
import { isPrescriptionRequired } from "@/services/prescriptionService";
import { getUserAddresses, Address } from "@/services/addressService";
import AddressForm from "@/components/checkout/AddressForm";
import PrescriptionUpload from "@/components/checkout/PrescriptionUpload";
import { createOrder } from "@/services/orders/createOrder";
import { UPI_PROVIDERS, BNPL_PROVIDERS, VALID_COUPONS } from "@/constants";
import { getDashboardApiService } from "@/pages/dashboardApiService";
import { OrderDataPayload } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin,
  Plus,
  Shield,
  Truck,
  Tag,
  Wallet,
  CreditCard,
  DollarSign,
  Smartphone,
  IndianRupee,
  Clock,
  Server,
  Calendar
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn, isLoading } = useAuth();
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [needsAddress, setNeedsAddress] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("express");
  const [recipientDetails, setRecipientDetails] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showBnplDetails, setShowBnplDetails] = useState(false);
  const [showUpiDetails, setShowUpiDetails] = useState(false);
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);
  
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  
  const [bnplProvider, setBnplProvider] = useState("simpl");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    const checkUserAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to proceed with checkout.",
          variant: "destructive"
        });
        navigate("/login");
      }
    };
    
    checkUserAuth();
  }, [navigate, toast, isLoggedIn, isLoading]);
  
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
      
      setRequiresPrescription(isPrescriptionRequired(parsedCart));
    } else {
      navigate("/cart");
    }
  }, [navigate]);
  
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);
        
        const defaultAddress = userAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0].id);
        } else {
          setNeedsAddress(true);
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };
    
    loadAddresses();
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
  
  useEffect(() => {
    if (deliveryTime !== "scheduled") {
      setScheduledDate(undefined);
      setScheduledTime("");
    }
  }, [deliveryTime]);
  
  const handleAddressAdded = (newAddress: Address) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress.id);
    setShowAddressForm(false);
    setNeedsAddress(false);
  };
  
  const handlePrescriptionUploaded = (url: string) => {
    setPrescriptionUrl(url);
  };

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
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address required",
        description: "Please select a delivery address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (requiresPrescription && !prescriptionUrl) {
      toast({
        title: "Prescription required",
        description: "Please upload a prescription for the medications that require it.",
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
    
    setLoading(true);
    
    try {
      const finalAmount = Math.max(0, total);
      const result = await createOrder({
        items: cartItems,
        totalAmount: finalAmount,
        deliveryAddressId: selectedAddress,
        prescriptionUrl: prescriptionUrl || undefined,
        paymentMethod
      });
      
      try {
        const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
        
        const dashboardOrderData: OrderDataPayload = {
          orderId: result.orderId,
          orderNumber: result.orderId,
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
          totalAmount: finalAmount,
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString()
        };
        
        console.log("Sending order to admin dashboard:", dashboardOrderData);
        getDashboardApiService().sendOrderData(dashboardOrderData).catch(error => {
          console.error("Failed to send order to admin dashboard:", error);
        });
      } catch (err) {
        console.error("Error sending order to admin dashboard:", err);
      }
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${result.orderId} has been placed successfully.`,
      });
      
      navigate(`/track-order/${result.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const subTotalAmount = parseFloat(subTotal.toString()) || 0;
  const deliveryFeeAmount = parseFloat(deliveryFee.toString()) || 0;
  const discountAmount = parseFloat(discount.toString()) || 0;
  const couponDiscountAmount = parseFloat(couponDiscount.toString()) || 0;
  
  const totalAmount = subTotalAmount + deliveryFeeAmount - discountAmount - couponDiscountAmount;
  const walletAmountToUse = useWallet ? Math.min(walletBalance, totalAmount) : 0;
  const finalAmount = Math.max(0, totalAmount - walletAmountToUse);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-zepmeds-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Checkout" />
      <ExitConfirmDialog />
      
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm 
            onAddressAdded={handleAddressAdded}
            onCancel={() => {
              if (needsAddress) {
                toast({
                  title: "Address Required",
                  description: "You need to add at least one address to proceed.",
                  variant: "destructive"
                });
              } else {
                setShowAddressForm(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
      
      <div className="fixed bottom-20 left-0 right-0 p-4 glass-morphism border-t border-white/10 backdrop-blur-lg z-20 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-white text-xl font-bold">₹{finalAmount.toFixed(2)}</p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 shadow-md"
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress || (requiresPrescription && !prescriptionUrl)}
          >
            {loading ? "Processing..." : "Place Order"}
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
          
          {addresses.length > 0 ? (
            <RadioGroup 
              value={selectedAddress || ""} 
              onValueChange={(value) => setSelectedAddress(value)}
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
                          value={address.id} 
                          id={`address-${address.id}`} 
                          className="text-blue-400"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-white font-medium">{address.address}</h3>
                          {address.is_default && (
                            <Badge variant="outline" className="ml-2 text-xs px-2 py-0 h-5 bg-green-900/30 text-green-400 border-green-800">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{address.city}, {address.state} {address.zipcode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-2">No addresses found</p>
              {!showAddressForm && (
                <Button 
                  variant="outline" 
                  className="text-blue-400 border-blue-800"
                  onClick={() => setShowAddressForm(true)}
                >
                  Add New Address
                </Button>
              )}
            </div>
          )}
          
          {!showAddressForm && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 text-blue-400 border-blue-800 hover:bg-blue-900/30"
              onClick={() => setShowAddressForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          )}
        </div>
        
        {requiresPrescription && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <Shield className="mr-2 text-red-400" size={20} />
              Prescription Required
            </h2>
            <PrescriptionUpload onPrescriptionUploaded={handlePrescriptionUploaded} />
          </div>
        )}
        
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
