import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAddresses, Address } from "@/services/addressService";
import { isPrescriptionRequired } from "@/services/prescriptionService";
import { createOrder } from "@/services/orders/createOrder";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardApiService } from "@/pages/dashboardApiService";
import { OrderDataPayload } from "@/types/order";

export const useCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoggedIn, session } = useAuth();
  
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
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      if (authChecked) return;
      
      console.log("Checking authentication status in Checkout");
      const { data } = await supabase.auth.getSession();
      
      if (!data.session && !isLoggedIn) {
        console.log("No auth session found, redirecting to login from Checkout");
        toast({
          title: "Authentication Required",
          description: "Please log in to proceed with checkout",
          variant: "destructive"
        });
        
        navigate("/login", { 
          state: { redirectAfterLogin: location.pathname } 
        });
      } else {
        console.log("Auth session found in Checkout:", data.session?.user?.id);
        setAuthChecked(true);
      }
      setIsAuthLoading(false);
    };
    
    checkUserAuth();
  }, [navigate, toast, isLoggedIn, location.pathname, authChecked]);
  
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
    if (!authChecked || !isLoggedIn || !session) return;
    
    const loadAddresses = async () => {
      try {
        console.log("Loading addresses for authenticated user");
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);
        
        if (userAddresses.length > 0) {
          const defaultAddress = userAddresses.find(addr => addr.is_default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.id);
          } else {
            setSelectedAddress(userAddresses[0].id);
          }
        } else {
          setNeedsAddress(true);
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };
    
    loadAddresses();
  }, [authChecked, isLoggedIn, session]);

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

  const handleRecipientDetailsChange = (details: any) => {
    setRecipientDetails(details);
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
    
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place your order",
        variant: "destructive"
      });
      navigate("/login", { state: { redirectAfterLogin: location.pathname } });
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
  
  return {
    isAuthLoading,
    authChecked,
    
    cartItems,
    subTotal: subTotalAmount,
    deliveryFee: deliveryFeeAmount,
    discount: discountAmount,
    couponDiscount: couponDiscountAmount,
    totalAmount,
    walletAmountToUse,
    finalAmount,
    
    addresses,
    selectedAddress,
    setSelectedAddress,
    showAddressForm,
    setShowAddressForm,
    needsAddress,
    setNeedsAddress,
    handleAddressAdded,
    
    requiresPrescription,
    prescriptionUrl,
    handlePrescriptionUploaded,
    
    deliveryTime,
    setDeliveryTime,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    
    couponCode, 
    setCouponCode,
    appliedCoupon,
    setAppliedCoupon,
    setCouponDiscount,
    
    walletBalance,
    useWallet,
    setUseWallet,
    
    recipientDetails,
    handleRecipientDetailsChange,
    
    paymentMethod,
    setPaymentMethod,
    
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCvv,
    showCardDetails,
    setShowCardDetails,
    
    bnplProvider,
    setBnplProvider,
    showBnplDetails,
    setShowBnplDetails,
    
    upiProvider,
    setUpiProvider,
    showUpiDetails,
    setShowUpiDetails,
    
    loading,
    handlePlaceOrder,
  };
};
