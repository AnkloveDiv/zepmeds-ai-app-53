
import { Home, Activity, UserRound, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: UserRound, label: "Doctor", path: "/doctor" },
    { icon: MoreHorizontal, label: "More", path: "/more" },
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
      </div>
    </div>
  );
};

export default BottomNavigation;
