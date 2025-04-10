
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const PhoneVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneNumber = location.state?.phoneNumber || "";

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const otpArray = pastedData.split("").slice(0, 4);
    const newOtp = [...otp];
    
    otpArray.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    if (otpArray.length > 0 && otpArray.length < 4) {
      inputRefs.current[otpArray.length]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      // In a real app, this would verify the OTP against a service
      // For demo, we'll just accept any 4-digit code
      login(phoneNumber);
      navigate("/dashboard");
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      // In a real app, this would trigger an OTP resend
      setCountdown(30);
      setCanResend(false);
      // Reset OTP fields
      setOtp(["", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a1f] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Verify Phone Number</h1>
          <p className="mt-2 text-gray-400">
            We've sent a verification code to <br />
            <span className="text-zepmeds-purple">+91 {phoneNumber}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="glass-morphism px-6 py-8 rounded-2xl shadow-xl">
            <div className="mb-6">
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 bg-black/20 border border-white/10 rounded-lg text-center text-xl font-bold text-white focus:border-zepmeds-purple focus:ring-1 focus:ring-zepmeds-purple outline-none"
                  />
                ))}
              </div>
            </div>

            <Button
              disabled={otp.some((digit) => !digit)}
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light transition-colors"
              onClick={handleVerify}
            >
              Verify
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    className="text-zepmeds-purple font-medium"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              className="text-gray-400 text-sm"
              onClick={() => navigate("/login")}
            >
              Change phone number
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhoneVerification;
