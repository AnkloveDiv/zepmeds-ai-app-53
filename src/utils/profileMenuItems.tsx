
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
  Clock,
  ShieldCheck,
  Heart,
  ShoppingBag,
  FileCheck,
  Settings,
  Bell
} from "lucide-react";
import { MenuItem } from "@/components/profile/ProfileMenu";

// Define colors for each category of icons
const healthIconColor = "text-green-500";
const orderIconColor = "text-orange-500";
const supportIconColor = "text-amber-500";
const accountIconColor = "text-red-500";
const financeIconColor = "text-purple-500";

export const getProfileMenuItems = (): MenuItem[] => {
  return [
    { 
      icon: <User size={20} className={accountIconColor} />, 
      title: "Patient Details", 
      path: "/patient-details",
      bgColor: "bg-red-500/10" 
    },
    { 
      icon: <MapPin size={20} className={accountIconColor} />, 
      title: "Manage Addresses", 
      path: "/addresses",
      bgColor: "bg-red-500/10" 
    },
    { 
      icon: <ClipboardList size={20} className={orderIconColor} />, 
      title: "Order History", 
      path: "/orders",
      bgColor: "bg-orange-500/10" 
    },
    { 
      icon: <Pill size={20} className={healthIconColor} />, 
      title: "Past Medicines", 
      path: "/past-medicines",
      bgColor: "bg-green-500/10" 
    },
    { 
      icon: <FileText size={20} className={healthIconColor} />, 
      title: "Medical Reports", 
      path: "/reports",
      bgColor: "bg-green-500/10" 
    },
    { 
      icon: <Stethoscope size={20} className={healthIconColor} />, 
      title: "Consult a Doctor", 
      path: "/doctor",
      bgColor: "bg-green-500/10" 
    },
    { 
      icon: <AlertCircle size={20} className={supportIconColor} />, 
      title: "Emergency Services", 
      path: "/emergency",
      bgColor: "bg-amber-500/10" 
    },
    { 
      icon: <Headphones size={20} className={supportIconColor} />, 
      title: "Help & Support", 
      path: "/support",
      bgColor: "bg-amber-500/10" 
    },
    { 
      icon: <Wallet size={20} className={financeIconColor} />, 
      title: "Wallet", 
      path: "/wallet",
      bgColor: "bg-purple-500/10" 
    },
    { 
      icon: <Ticket size={20} className={financeIconColor} />, 
      title: "Coupons", 
      path: "/coupons",
      bgColor: "bg-purple-500/10" 
    },
    { 
      icon: <Gift size={20} className={financeIconColor} />, 
      title: "Offers", 
      path: "/offers",
      bgColor: "bg-purple-500/10" 
    },
    { 
      icon: <Clock size={20} className={orderIconColor} />, 
      title: "Schedule Medicines", 
      path: "/schedule-medicines",
      bgColor: "bg-orange-500/10" 
    },
    { 
      icon: <Code size={20} className={accountIconColor} />, 
      title: "About Developers", 
      path: "/about-developers",
      bgColor: "bg-red-500/10" 
    }
  ];
};
