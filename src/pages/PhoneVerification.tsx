
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your OTP must be 6 digits."
  }).max(6)
});

const PhoneVerification: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useBackNavigation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      if (values.otp === "123456") {
        setIsVerified(true);
        toast.success("OTP verified successfully");
        
        // Navigate to dashboard after successful verification
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
      setIsVerifying(false);
    }, 1500);
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
            Enter the 6-digit code sent to your phone number.
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
                  disabled={isVerifying || isVerified || !form.getValues().otp || form.getValues().otp.length < 6}
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
            Didn't receive a code? <Button variant="link" className="p-0 h-auto" onClick={() => toast.info("New code sent!")}>Resend OTP</Button>
          </p>
          <p className="text-xs text-center text-gray-400">
            For demo purposes, use "123456" as the OTP code
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhoneVerification;
