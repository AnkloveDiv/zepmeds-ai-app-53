
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !password || password.length < 6) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log("Attempting to sign up with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        toast.error(error.message || "Failed to sign up. Please try again.");
      } else if (data.user) {
        console.log("Supabase signup successful:", data);
        toast.success("Account created successfully! You can now log in.");
        
        // Auto-login after signup
        await login(phoneNumber, data.user, data.session);
        
        // Redirect to appropriate page
        const redirectPath = location.state?.redirectAfterLogin || '/dashboard';
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error("Error during email signup:", error);
      toast.error(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !password) {
      toast.error("Please enter a valid email and password");
      return;
    }
    
    setIsSending(true);
    
    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        toast.error(error.message || "Invalid email or password");
      } else if (data.user) {
        console.log("Supabase login successful:", data);
        toast.success("Login successful!");
        
        // Update auth context
        await login(phoneNumber, data.user, data.session);
        
        // Redirect to appropriate page
        const redirectPath = location.state?.redirectAfterLogin || '/dashboard';
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error("Error during email login:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsSending(false);
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
                <form onSubmit={handleEmailLogin}>
                  <div className="mb-4">
                    <label
                      htmlFor="email-login"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email-login"
                      type="email"
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label
                      htmlFor="password-login"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <Input
                      id="password-login"
                      type="password"
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light transition-colors mt-4"
                  >
                    {isSending ? "Processing..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleEmailSignup}>
                  <div className="mb-4">
                    <label
                      htmlFor="email-signup"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email-signup"
                      type="email"
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label
                      htmlFor="password-signup"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <Input
                      id="password-signup"
                      type="password"
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
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
