
// SMS service integration for handling OTP delivery
// This is a simple mock implementation that would be replaced with an actual SMS provider

// In a real application, this would use Twilio, MessageBird, or another SMS provider
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; otp?: string }> => {
  try {
    // For demo purposes, we'll generate a random 6-digit OTP
    // In production, this would call your SMS provider's API
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`[DEMO] Sending OTP ${otp} to phone number ${phoneNumber}`);
    
    // Store OTP in sessionStorage for verification (in a real app, this would be server-side)
    // WARNING: This is only for demo purposes and is not secure for production
    sessionStorage.setItem(`otp_${phoneNumber}`, otp);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always show OTP in toast notification for demo purposes
    // In production, this would be removed and the OTP would be sent via SMS
    console.log("Displaying OTP for demo:", otp);
    
    // For development/demo, return the OTP so we can display it
    return { success: true, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false };
  }
};

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    // Get the stored OTP from sessionStorage
    const storedOTP = sessionStorage.getItem(`otp_${phoneNumber}`);
    
    console.log("Verifying OTP:", otp, "against stored OTP:", storedOTP);
    
    // Check if OTP matches
    const isValid = storedOTP === otp;
    
    // Clear OTP after verification attempt for security
    if (isValid) {
      console.log("OTP verification successful, clearing stored OTP");
      sessionStorage.removeItem(`otp_${phoneNumber}`);
    } else {
      console.log("OTP verification failed");
    }
    
    return isValid;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};
