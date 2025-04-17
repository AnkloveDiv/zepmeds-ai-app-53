import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendOTP } from "@/services/smsService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Check if user is already logged in, redirect to dashboard if so
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (isLoggedIn || data.session) {
        console.log("User already logged in");
        // Get the redirect path from location state or default to dashboard
        const redirectPath = location.state?.redirectAfterLogin || '/dashboard';
        navigate(redirectPath);
      }
    };
    
    checkAuth();
  }, [isLoggedIn, navigate, location.state]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(value);
    setIsValid(validatePhone(value));
  };

  const handleOTPSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsSending(true);
      
      try {
        const result = await sendOTP(phoneNumber);
        
        if (result.success) {
          toast.success("OTP sent to your phone number");
          if (result.otp) {
            toast.info(`Your OTP is: ${result.otp}`, {
              duration: 10000,
            });
          }
          navigate("/verify", { 
            state: { 
              phoneNumber,
              redirectAfterLogin: location.state?.redirectAfterLogin 
            } 
          });
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Error sending OTP:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Directly send OTP without creating order
      handleOTPSend(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-primary">
            Welcome to Zepmeds
          </h1>
          <p className="mt-2 text-gray-400">
            Login or create an account to continue
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="glass-morphism px-6 py-8 rounded-2xl shadow-xl">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-400">+91</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-12 bg-black/20 border-white/10 text-white"
                        placeholder="Enter your 10-digit phone number"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength={10}
                      />
                    </div>
                    {phoneNumber && !isValid && (
                      <p className="mt-1 text-xs text-red-500">
                        Please enter a valid 10-digit phone number
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || isSending}
                    className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light transition-colors mt-4"
                  >
                    {isSending ? "Processing..." : "Continue"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="phone-signup"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-400">+91</span>
                      </div>
                      <Input
                        id="phone-signup"
                        type="tel"
                        className="pl-12 bg-black/20 border-white/10 text-white"
                        placeholder="Enter your 10-digit phone number"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength={10}
                      />
                    </div>
                    {phoneNumber && !isValid && (
                      <p className="mt-1 text-xs text-red-500">
                        Please enter a valid 10-digit phone number
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || isSending}
                    className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light transition-colors mt-4"
                  >
                    {isSending ? "Processing..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                By continuing, you agree to our{" "}
                <a href="#" className="text-zepmeds-purple">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-zepmeds-purple">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
