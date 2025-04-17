
import React from "react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { VALID_COUPONS } from "@/constants";

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: string;
  setAppliedCoupon: (coupon: string) => void;
  couponDiscount: number;
  setCouponDiscount: (amount: number) => void;
  subTotal: number;
}

const CouponSection = ({
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
  couponDiscount,
  setCouponDiscount,
  subTotal
}: CouponSectionProps) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default CouponSection;
