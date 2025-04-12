
import { Home, Activity, UserRound, ShoppingCart, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [accentColors, setAccentColors] = useState<Record<string, string>>({});
  
  const getRandomAccentColor = () => {
    const colors = ['orange', 'red', 'green', 'blue', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  useEffect(() => {
    // Assign random accent colors to each nav item
    const newColors: Record<string, string> = {};
    navItems.forEach(item => {
      newColors[item.path] = getRandomAccentColor();
    });
    setAccentColors(newColors);
  }, []);

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
    { name: "Help & Support", path: "/support", icon: "🛟", color: "bg-blue-500/20" },
    { name: "My Wallet", path: "/wallet", icon: "💰", color: "bg-amber-500/20" },
    { name: "Coupons", path: "/coupons", icon: "🎫", color: "bg-green-500/20" },
    { name: "Offers", path: "/offers", icon: "🎁", color: "bg-red-500/20" },
    { name: "Prescriptions", path: "/prescription-upload", icon: "📋", color: "bg-purple-500/20" },
    { name: "Medical Reports", path: "/reports", icon: "📊", color: "bg-blue-500/20" },
    { name: "Emergency Services", path: "/emergency", icon: "🚑", color: "bg-red-500/20" },
    { name: "Order History", path: "/orders", icon: "📦", color: "bg-amber-500/20" },
    { name: "Manage Addresses", path: "/addresses", icon: "🏠", color: "bg-green-500/20" },
    { name: "About Developers", path: "/about-developers", icon: "👨‍💻", color: "bg-purple-500/20" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 py-2 px-4 z-30">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const color = accentColors[item.path] || 'blue';
          const isActiveItem = isActive(item.path);
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center px-3 py-1 relative"
            >
              {isActiveItem && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute inset-0 rounded-lg bg-accent-${color}`}
                  style={{
                    boxShadow: `0 0 15px 2px var(--color-accent-${color})`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon
                className={`h-6 w-6 z-10 ${
                  isActiveItem 
                    ? `text-accent-${color}` 
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs mt-1 z-10 ${
                  isActiveItem 
                    ? `font-medium text-accent-${color}` 
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        
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
                  <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center`}>
                    <span className="text-2xl">{option.icon}</span>
                  </div>
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
