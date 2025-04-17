import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { verifyOTP, sendOTP } from '@/services/smsService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 digits.",
  }),
});

const PhoneVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useBackNavigation();

  useEffect(() => {
    // Check if user is already logged in, redirect to appropriate page if so
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (isLoggedIn || data.session) {
        console.log("User already logged in");
        const redirectPath = location.state?.redirectAfterLogin || '/dashboard';
        navigate(redirectPath);
        return;
      }
    };
    
    checkAuth();
    
    // Extract phone number from the state passed by the Login page
    if (location.state && location.state.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location.state, isLoggedIn, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleResendOTP = async () => {
    if (!resendDisabled && phoneNumber) {
      try {
        setIsResending(true);
        await sendOTP(phoneNumber);
        toast.success("OTP resent successfully");
        setResendDisabled(true);
      } catch (error) {
        toast.error("Failed to resend OTP");
        console.error(error);
      } finally {
        setIsResending(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (phoneNumber) {
      try {
        setIsVerifying(true);
        const isValid = await verifyOTP(phoneNumber, values.otp);
        
        if (isValid) {
          setIsVerified(true);
          toast.success("OTP verified successfully");
          
          login(phoneNumber);
          
          // Redirect to the appropriate page after login
          const redirectPath = location.state?.redirectAfterLogin || '/dashboard';
          navigate(redirectPath);
        } else {
          toast.error("Invalid OTP. Please try again.");
        }
      } catch (error) {
        toast.error("Verification failed. Please try again.");
        console.error(error);
      } finally {
        setIsVerifying(false);
      }
    } else {
      toast.error("Phone number not available. Please go back and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zepmeds-light-bg to-zepmeds-bg p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-zepmeds-purple">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit code to {phoneNumber}
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
              <Button 
                type="submit" 
                className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light transition-colors"
                disabled={isVerifying || isVerified}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center">
            Didn't receive the code?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm text-zepmeds-purple"
              disabled={resendDisabled || isResending}
              onClick={handleResendOTP}
            >
              {resendDisabled ? `Resend in ${countdown}s` : (isResending ? "Sending..." : "Resend OTP")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhoneVerification;
