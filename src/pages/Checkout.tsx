
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OrderForSomeoneElse, { RecipientDetails } from "@/components/checkout/OrderForSomeoneElse";
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
  AlertCircle,
  Home,
  Briefcase,
  Check,
  Save
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Address {
  id: string;
  name: string;
  phone: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [upiOption, setUpiOption] = useState("");
  const [showBNPLVerify, setShowBNPLVerify] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [bnplVerified, setBnplVerified] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: ""
  });
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500); // Mock wallet balance
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  
  // Use back navigation hook
  useBackNavigation();

  useEffect(() => {
    // Load saved addresses from local storage
    const addresses = localStorage.getItem('savedAddresses');
    if (addresses) {
      setSavedAddresses(JSON.parse(addresses));
      
      // Set default address if available
      const defaultAddress = JSON.parse(addresses).find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setDeliveryAddress({
          fullName: defaultAddress.name,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          pincode: defaultAddress.pincode,
          landmark: defaultAddress.landmark || ""
        });
      }
    }
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const selectAddress = (address: Address) => {
    setDeliveryAddress({
      fullName: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      landmark: address.landmark || ""
    });
  };

  const saveCurrentAddress = () => {
    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || 
        !deliveryAddress.city || !deliveryAddress.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      name: deliveryAddress.fullName,
      phone: deliveryAddress.phone,
      type: 'home',
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      pincode: deliveryAddress.pincode,
      landmark: deliveryAddress.landmark,
      isDefault: savedAddresses.length === 0 // Make it default if it's the first address
    };
    
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    
    toast({
      title: "Address saved",
      description: "Your address has been saved for future use"
    });
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

  const handleRecipientDetailsChange = (details: RecipientDetails) => {
    setRecipientDetails(Object.values(details).some(value => value) ? details : null);
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
    
    // For card payment, validate card details
    if (paymentMethod === "online" && showCardDetails) {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "Missing card information",
          description: "Please fill all card details",
          variant: "destructive"
        });
        return;
      }
    }
    
    // For UPI, validate selection
    if (paymentMethod === "upi" && !upiOption) {
      toast({
        title: "Missing UPI option",
        description: "Please select a UPI payment option",
        variant: "destructive"
      });
      return;
    }

    // For wallet, check balance
    if (paymentMethod === "wallet") {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cartItems.reduce((acc: number, item: any) => 
        acc + (item.price * item.quantity * item.stripQuantity), 0) + 40; // Adding delivery fee
        
      if (walletBalance < total) {
        setShowLowBalance(true);
        return;
      }
    }
    
    // Save address if option is selected
    if (saveAddress) {
      saveCurrentAddress();
    }

    // Get cart total
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const subtotal = cartItems.reduce((acc: number, item: any) => 
      acc + (item.price * item.quantity * item.stripQuantity), 0);
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    // Determine which address to use (recipient's or buyer's)
    const finalDeliveryAddress = recipientDetails ? {
      fullName: recipientDetails.name,
      phone: recipientDetails.phone,
      address: recipientDetails.address,
      city: recipientDetails.city,
      pincode: recipientDetails.pincode,
      landmark: recipientDetails.landmark
    } : deliveryAddress;

    // Save order details (in a real app, this would be an API call)
    const orderDetails = {
      id: `ORD${Math.floor(Math.random() * 10000)}`,
      paymentMethod,
      paymentDetails: paymentMethod === "upi" ? { method: upiOption } : {},
      deliveryAddress: finalDeliveryAddress,
      recipientDetails: recipientDetails, // Store recipient details if order is for someone else
      items: cartItems,
      status: "confirmed",
      timestamp: new Date().toISOString(),
      deliveryRider: {
        name: "Rahul Kumar",
        rating: 4.8,
        phone: "+91 9876543210",
        eta: "15 minutes"
      },
      estimatedDelivery: "30-45 minutes",
      paymentInfo: {
        subtotal,
        deliveryFee,
        taxes: 0,
        discount: 0,
        total
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

  const renderUPIOptions = () => (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {[
        { id: "gpay", name: "Google Pay", logo: "/images/gpay.png", fallbackLogo: "G" },
        { id: "phonepe", name: "PhonePe", logo: "/images/phonepe.png", fallbackLogo: "P" },
        { id: "paytm", name: "Paytm", logo: "/images/paytm.png", fallbackLogo: "PT" },
        { id: "bhim", name: "BHIM UPI", logo: "/images/bhim.png", fallbackLogo: "B" },
        { id: "mobikwik", name: "MobiKwik", logo: "/images/mobikwik.png", fallbackLogo: "M" },
        { id: "amazon", name: "Amazon Pay", logo: "/images/amazon.png", fallbackLogo: "A" }
      ].map(option => (
        <div 
          key={option.id}
          onClick={() => setUpiOption(option.id)}
          className={`p-3 rounded-lg border transition-colors cursor-pointer flex flex-col items-center justify-center ${
            upiOption === option.id 
              ? "border-zepmeds-purple bg-zepmeds-purple/10" 
              : "border-gray-700 bg-black/20"
          }`}
        >
          <div className="text-2xl mb-1 h-8 w-8 flex items-center justify-center bg-gray-800 rounded-full">
            {option.fallbackLogo}
          </div>
          <span className="text-xs text-center">{option.name}</span>
          {upiOption === option.id && (
            <Check size={16} className="text-zepmeds-purple mt-1" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header showBackButton title="Checkout" />
      
      <main className="px-4 py-4">
        {/* Order For Someone Else Section */}
        <OrderForSomeoneElse onChange={handleRecipientDetailsChange} />
        
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-zepmeds-purple">
                  <Plus size={16} className="mr-1" /> Select
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-gray-800">
                <DialogHeader>
                  <DialogTitle>Saved Addresses</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 my-4 max-h-[300px] overflow-y-auto">
                  {savedAddresses.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No saved addresses found</p>
                  ) : (
                    savedAddresses.map(address => (
                      <div 
                        key={address.id}
                        className="border border-gray-700 rounded-lg p-3 hover:border-zepmeds-purple/50 cursor-pointer transition-colors"
                        onClick={() => {
                          selectAddress(address);
                          (document.activeElement as HTMLElement)?.blur();
                        }}
                      >
                        <div className="flex items-start">
                          <div className="rounded-full p-2 mr-3 bg-zepmeds-purple/10 text-zepmeds-purple">
                            {address.type === 'home' ? (
                              <Home size={16} />
                            ) : address.type === 'work' ? (
                              <Briefcase size={16} />
                            ) : (
                              <MapPin size={16} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{address.name}</h4>
                            <p className="text-sm text-gray-400">{address.phone}</p>
                            <p className="text-sm text-gray-400 mt-1">{address.address}, {address.city}, {address.pincode}</p>
                            {address.landmark && <p className="text-xs text-gray-500">Landmark: {address.landmark}</p>}
                            {address.isDefault && (
                              <span className="text-xs bg-zepmeds-purple/20 text-zepmeds-purple px-2 py-0.5 rounded-full mt-2 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <DialogClose asChild>
                  <Button className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90">
                    Done
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
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
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAddress}
                onChange={() => setSaveAddress(!saveAddress)}
                className="rounded border-gray-700 bg-black/20 mr-2"
              />
              <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                Save this address for future orders
              </Label>
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
              
              {paymentMethod === "online" && (
                <div className="ml-8 p-3 bg-black/10 rounded-lg border border-gray-800">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mb-3 text-zepmeds-purple border-zepmeds-purple/30"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                  >
                    {showCardDetails ? "Hide Card Details" : "Enter Card Details"}
                  </Button>
                  
                  {showCardDetails && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="number"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardDetails.number}
                          onChange={handleCardDetailsChange}
                          className="bg-black/20 border-white/10"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          name="name"
                          placeholder="Name on card"
                          value={cardDetails.name}
                          onChange={handleCardDetailsChange}
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                          <Input
                            id="cardExpiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardDetailsChange}
                            className="bg-black/20 border-white/10"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCVV">CVV</Label>
                          <Input
                            id="cardCVV"
                            name="cvv"
                            type="password"
                            placeholder="XXX"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            className="bg-black/20 border-white/10"
                            maxLength={3}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                        <div className="flex items-center">
                          <ShieldCheck size={14} className="mr-1 text-green-500" />
                          <span>Secure payment</span>
                        </div>
                        <span>Your card info is encrypted</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer">
                  <IndianRupee size={18} className="mr-2 text-zepmeds-purple" />
                  <span>UPI Payment</span>
                </Label>
              </div>
              
              {paymentMethod === "upi" && renderUPIOptions()}
              
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet size={18} className="mr-2 text-zepmeds-purple" />
                  <span>Wallet</span>
                  <span className="ml-2 text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">
                    Balance: ₹{walletBalance}
                  </span>
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

      {/* Low Balance Warning Dialog */}
      <Dialog open={showLowBalance} onOpenChange={setShowLowBalance}>
        <DialogContent className="bg-background border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Insufficient Wallet Balance</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-amber-400">Your wallet balance is insufficient for this purchase.</p>
                <p className="text-xs text-amber-400/70 mt-1">Current balance: ₹{walletBalance}</p>
                <p className="text-xs text-amber-400/70">Required amount: ₹800</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowLowBalance(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-zepmeds-purple hover:bg-zepmeds-purple-light"
                onClick={() => {
                  setShowLowBalance(false);
                  navigate("/wallet"); // Navigate to wallet to add funds
                }}
              >
                Add Money to Wallet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
