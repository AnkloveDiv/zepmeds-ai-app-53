
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PhoneVerification from "./pages/PhoneVerification";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MedicineDelivery from "./pages/MedicineDelivery";
import DoctorConsultation from "./pages/DoctorConsultation";
import NotFound from "./pages/NotFound";
import Activity from "./pages/Activity";
import AISymptomChecker from "./pages/AISymptomChecker";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import TrackOrder from "./pages/TrackOrder";
import PatientDetails from "./pages/PatientDetails";
import ManageAddresses from "./pages/ManageAddresses";
import OrderHistory from "./pages/OrderHistory";
import MedicalReports from "./pages/MedicalReports";
import EmergencyServices from "./pages/EmergencyServices";
import Wallet from "./pages/Wallet";
import Coupons from "./pages/Coupons";
import Offers from "./pages/Offers";
import DeveloperInfo from "./pages/DeveloperInfo";
import Support from "./pages/Support";
import ScheduleMedicines from "./pages/ScheduleMedicines";
import PetCare from "./pages/PetCare";
import MedicalDevices from "./pages/MedicalDevices";

const queryClient = new QueryClient();

// App wrapper that includes router
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Separate component for app content so we can use hooks inside
const AppContent = () => {
  // No permission modal code - removed as requested

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<PhoneVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medicine-delivery" element={<MedicineDelivery />} />
        <Route path="/doctor" element={<DoctorConsultation />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/symptom-checker" element={<AISymptomChecker />} />
        <Route path="/prescription-upload" element={<PrescriptionUpload />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/support" element={<Support />} />
        <Route path="/schedule-medicines" element={<ScheduleMedicines />} />
        <Route path="/pet-care" element={<PetCare />} />
        <Route path="/medical-devices" element={<MedicalDevices />} />
        
        {/* Profile Section Routes */}
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/addresses" element={<ManageAddresses />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/reports" element={<MedicalReports />} />
        <Route path="/emergency" element={<EmergencyServices />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about-developers" element={<DeveloperInfo />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
