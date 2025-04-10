
import { Home, Activity, UserRound, ShoppingCart, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const BottomNavigation = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: UserRound, label: "Doctor", path: "/doctor" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
  ];

  const moreOptions = [
    { name: "Help & Support", path: "/support", icon: "🛟" },
    { name: "My Wallet", path: "/wallet", icon: "💰" },
    { name: "Coupons", path: "/coupons", icon: "🎫" },
    { name: "Offers", path: "/offers", icon: "🎁" },
    { name: "Prescriptions", path: "/prescription-upload", icon: "📋" },
    { name: "Medical Reports", path: "/reports", icon: "📊" },
    { name: "Emergency Services", path: "/emergency", icon: "🚑" },
    { name: "Order History", path: "/orders", icon: "📦" },
    { name: "Manage Addresses", path: "/addresses", icon: "🏠" },
    { name: "About Developers", path: "/about-developers", icon: "👨‍💻" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 py-2 px-4 z-30">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center px-3 py-1 relative"
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-0 rounded-lg bg-zepmeds-purple/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <item.icon
              className={`h-6 w-6 ${
                isActive(item.path) 
                  ? "text-zepmeds-purple" 
                  : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive(item.path) 
                  ? "font-medium text-zepmeds-purple" 
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
        
        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-col items-center px-3 py-1 relative cursor-pointer">
              <MoreHorizontal className="h-6 w-6 text-gray-400" />
              <span className="text-xs mt-1 text-gray-400">More</span>
            </div>
          </DrawerTrigger>
          <DrawerContent className="bg-background border-t border-white/10">
            <DrawerHeader>
              <DrawerTitle className="text-white">More Options</DrawerTitle>
              <DrawerDescription>
                Explore more features and services
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 grid grid-cols-3 gap-4">
              {moreOptions.map((option) => (
                <Link 
                  key={option.name}
                  to={option.path}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5 hover:bg-zepmeds-purple/10 transition-all"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs text-center text-white">{option.name}</span>
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default BottomNavigation;
