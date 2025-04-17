
import React from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import OrderForSomeoneElse from "@/components/checkout/OrderForSomeoneElse";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddressForm from "@/components/checkout/AddressForm";
import AddressSelection from "@/components/checkout/AddressSelection";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import CouponSection from "@/components/checkout/CouponSection";
import WalletSection from "@/components/checkout/WalletSection";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import OrderSummary from "@/components/checkout/OrderSummary";
import PrescriptionSection from "@/components/checkout/PrescriptionSection";
import { useCheckout } from "@/hooks/useCheckout";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const auth = useAuthGuard();
  const { ExitConfirmDialog } = useBackNavigation();
  const checkout = useCheckout();
  const { toast } = useToast(); // Get toast directly from useToast hook
  
  if (auth.isAuthLoading || checkout.isAuthLoading || (!checkout.authChecked && !auth.isAuthenticated)) {
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
      
      <Dialog open={checkout.showAddressForm} onOpenChange={checkout.setShowAddressForm}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm 
            onAddressAdded={checkout.handleAddressAdded}
            onCancel={() => {
              if (checkout.needsAddress) {
                toast({
                  title: "Address Required",
                  description: "You need to add at least one address to proceed.",
                  variant: "destructive"
                });
              } else {
                checkout.setShowAddressForm(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
      
      <OrderSummary 
        finalAmount={checkout.finalAmount}
        loading={checkout.loading}
        selectedAddress={checkout.selectedAddress}
        requiresPrescription={checkout.requiresPrescription}
        prescriptionUrl={checkout.prescriptionUrl}
        onPlaceOrder={checkout.handlePlaceOrder}
      />
      
      <div className="fixed top-16 right-4 z-20">
        <div className="bg-gradient-to-r from-green-500 to-teal-400 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-white text-sm font-bold">₹{checkout.finalAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <main className="px-4 py-4 space-y-6 mb-20">
        <AddressSelection 
          addresses={checkout.addresses}
          selectedAddress={checkout.selectedAddress}
          setSelectedAddress={checkout.setSelectedAddress}
          onAddNewAddress={() => checkout.setShowAddressForm(true)}
        />
        
        {checkout.requiresPrescription && (
          <PrescriptionSection 
            onPrescriptionUploaded={checkout.handlePrescriptionUploaded} 
          />
        )}
        
        <DeliveryOptions 
          deliveryTime={checkout.deliveryTime}
          setDeliveryTime={checkout.setDeliveryTime}
          scheduledDate={checkout.scheduledDate}
          setScheduledDate={checkout.setScheduledDate}
          scheduledTime={checkout.scheduledTime}
          setScheduledTime={checkout.setScheduledTime}
        />
        
        <CouponSection 
          couponCode={checkout.couponCode}
          setCouponCode={checkout.setCouponCode}
          appliedCoupon={checkout.appliedCoupon}
          setAppliedCoupon={checkout.setAppliedCoupon}
          couponDiscount={checkout.couponDiscount}
          setCouponDiscount={checkout.setCouponDiscount}
          subTotal={checkout.subTotal}
        />
        
        <WalletSection 
          walletBalance={checkout.walletBalance}
          useWallet={checkout.useWallet}
          setUseWallet={checkout.setUseWallet}
        />
        
        <OrderForSomeoneElse onChange={checkout.handleRecipientDetailsChange} />
        
        <PaymentMethods 
          paymentMethod={checkout.paymentMethod}
          setPaymentMethod={checkout.setPaymentMethod}
          cardNumber={checkout.cardNumber}
          setCardNumber={checkout.setCardNumber}
          cardName={checkout.cardName}
          setCardName={checkout.setCardName}
          cardExpiry={checkout.cardExpiry}
          setCardExpiry={checkout.setCardExpiry}
          cardCvv={checkout.cardCvv}
          setCvv={checkout.setCvv}
          showCardDetails={checkout.showCardDetails}
          setShowCardDetails={checkout.setShowCardDetails}
          bnplProvider={checkout.bnplProvider}
          setBnplProvider={checkout.setBnplProvider}
          showBnplDetails={checkout.showBnplDetails}
          setShowBnplDetails={checkout.setShowBnplDetails}
          upiProvider={checkout.upiProvider}
          setUpiProvider={checkout.setUpiProvider}
          showUpiDetails={checkout.showUpiDetails}
          setShowUpiDetails={checkout.setShowUpiDetails}
        />
      </main>
    </div>
  );
};

export default Checkout;
