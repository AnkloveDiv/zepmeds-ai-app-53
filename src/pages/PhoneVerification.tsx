import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { verifyOTP, sendOTP } from '@/services/smsService';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderCreation } from "@/hooks/useOrderCreation";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your OTP must be 6 digits."
  }).max(6)
});

const PhoneVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goBack } = useBackNavigation();
  const { login } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { createOrder, loading: orderLoading } = useOrderCreation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (location.state?.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
      
      const storedOTP = sessionStorage.getItem(`otp_${location.state.phoneNumber}`);
      if (storedOTP) {
        toast.info(`Your OTP is: ${storedOTP}`, {
          duration: 10000,
        });
      }
    } else {
      toast.error("No phone number provided");
      navigate("/login");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer: number | undefined;
    
    if (resendDisabled && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!phoneNumber) {
      toast.error("Phone number not found");
      navigate("/login");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      console.log("Submitting form with OTP:", values.otp);
      console.log("Verifying OTP:", values.otp, "for phone:", phoneNumber);
      
      const isValid = await verifyOTP(phoneNumber, values.otp);
      console.log("Verification result:", isValid);
      
      if (isValid) {
        setIsVerified(true);
        toast.success("OTP verified successfully");
        
        try {
          const orderResult = await createOrder({
            customer_name: phoneNumber,
            date: new Date(),
            amount: 0,
            prescription: 'Welcome to Zepmeds'
          });
          
          console.log("Welcome order created:", orderResult);
        } catch (orderError) {
          console.error("Error creating welcome order:", orderError);
        }
        
        login(phoneNumber);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid OTP. Please try again.");
        form.setError("otp", { 
          type: "manual", 
          message: "Incorrect OTP. Please check and try again." 
        });
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error("Error verifying OTP:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber || resendDisabled) return;
    
    try {
      setResendDisabled(true);
      
      const result = await sendOTP(phoneNumber);
      
      if (result.success) {
        toast.success("OTP resent successfully");
        
        if (result.otp) {
          toast.info(`Your OTP is: ${result.otp}`, {
            duration: 10000,
          });
        }
      } else {
        toast.error("Failed to resend OTP");
        setResendDisabled(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error resending OTP:", error);
      setResendDisabled(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 flex items-center gap-1"
        onClick={goBack}
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Verify Your Phone</CardTitle>
          <CardDescription>
            {phoneNumber ? (
              <>
                Enter the 6-digit code sent to <span className="font-medium">+91 {phoneNumber}</span>
              </>
            ) : (
              "Enter the 6-digit code sent to your phone number."
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP 
                        maxLength={6}
                        {...field}
                        disabled={isVerifying || isVerified}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isVerified && (
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isVerifying || isVerified}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              )}
            </form>
          </Form>
          
          {isVerified && (
            <div className="flex flex-col items-center justify-center mt-6 text-center">
              <CheckCircle className="text-green-500 h-10 w-10 mb-2" />
              <p className="text-green-600 font-medium">OTP Verified Successfully</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-gray-500">
            Didn't receive a code? {" "}
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
            </Button>
          </p>
          <p className="text-xs text-center text-gray-400">
            Check the toast notifications for your OTP
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhoneVerification;
