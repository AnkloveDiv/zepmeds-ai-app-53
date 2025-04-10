
import { 
  User, 
  MapPin, 
  ClipboardList, 
  Pill, 
  FileText,
  Stethoscope, 
  AlertCircle, 
  Headphones, 
  Wallet, 
  Ticket,
  Gift,
  Code,
  Smartphone
} from "lucide-react";
import { MenuItem } from "@/components/profile/ProfileMenu";

export const getProfileMenuItems = (): MenuItem[] => {
  return [
    { icon: <User size={20} />, title: "Patient Details", path: "/patient-details" },
    { icon: <MapPin size={20} />, title: "Manage Addresses", path: "/addresses" },
    { icon: <ClipboardList size={20} />, title: "Order History", path: "/orders" },
    { icon: <Pill size={20} />, title: "Past Medicines", path: "/past-medicines" },
    { icon: <FileText size={20} />, title: "Medical Reports", path: "/reports" },
    { icon: <Stethoscope size={20} />, title: "Consult a Doctor", path: "/doctor" },
    { icon: <AlertCircle size={20} />, title: "Emergency Services", path: "/emergency" },
    { icon: <Headphones size={20} />, title: "Help & Support", path: "/support" },
    { icon: <Wallet size={20} />, title: "Wallet", path: "/wallet" },
    { icon: <Ticket size={20} />, title: "Coupons", path: "/coupons" },
    { icon: <Gift size={20} />, title: "Offers", path: "/offers" },
    { icon: <Smartphone size={20} />, title: "App Guide", path: "/app-guide" },
    { icon: <Code size={20} />, title: "About Developers", path: "/about-developers" }
  ];
};
