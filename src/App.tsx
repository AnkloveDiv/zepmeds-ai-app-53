
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PhoneVerification from "./pages/PhoneVerification";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MedicineDelivery from "./pages/MedicineDelivery";
import DoctorConsultation from "./pages/DoctorConsultation";
import NotFound from "./pages/NotFound";
import PermissionsModal from "./components/PermissionsModal";
import Activity from "./pages/Activity";
import AISymptomChecker from "./pages/AISymptomChecker";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import PatientDetails from "./pages/PatientDetails";
import ManageAddresses from "./pages/ManageAddresses";
import OrderHistory from "./pages/OrderHistory";
import MedicalReports from "./pages/MedicalReports";
import EmergencyServices from "./pages/EmergencyServices";
import Wallet from "./pages/Wallet";
import Coupons from "./pages/Coupons";
import Offers from "./pages/Offers";
import DeveloperInfo from "./pages/DeveloperInfo";

const queryClient = new QueryClient();

const App = () => {
  const [showPermissions, setShowPermissions] = useState(false);

  // Check if user is logged in and needs to show permissions
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const permissionsGranted = localStorage.getItem("permissionsGranted");
    
    if (isLoggedIn === "true" && permissionsGranted !== "true") {
      setShowPermissions(true);
    }
  }, []);

  const handlePermissionsGranted = () => {
    localStorage.setItem("permissionsGranted", "true");
    setShowPermissions(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showPermissions && <PermissionsModal onGranted={handlePermissionsGranted} />}
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
