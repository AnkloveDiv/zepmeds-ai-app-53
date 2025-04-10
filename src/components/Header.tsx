
import { Link } from "react-router-dom";
import { MapPin, Bell, ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton, title }: HeaderProps) => {
  const [location, setLocation] = useState("Current Location");
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("");
    }
    return user?.phoneNumber?.slice(-2) || "ZM";
  };

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton ? (
            <Link to="/dashboard" className="mr-3">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-black/20 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </Link>
          ) : (
            <Link to="/profile" className="mr-3">
              <Avatar>
                <AvatarImage src="" alt={user?.name || "User"} />
                <AvatarFallback className="bg-zepmeds-purple text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          {title ? (
            <h1 className="font-semibold text-lg text-white">{title}</h1>
          ) : (
            <div>
              <div className="text-xs text-gray-400">Deliver to</div>
              <div className="flex items-center text-sm font-medium text-white">
                <MapPin className="h-4 w-4 mr-1 text-zepmeds-purple" />
                <span className="mr-1">{location}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              className="rounded-full w-9 h-9 flex items-center justify-center bg-black/20 text-white"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 glass-morphism rounded-lg shadow-lg overflow-hidden z-20"
                >
                  <div className="p-3 border-b border-white/10">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="p-2 max-h-96 overflow-y-auto">
                    <div className="py-2 px-3 hover:bg-white/5 rounded-lg transition">
                      <p className="text-sm font-medium text-white">
                        Your order #ZM12345 has been delivered
                      </p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                    <div className="py-2 px-3 hover:bg-white/5 rounded-lg transition">
                      <p className="text-sm font-medium text-white">
                        New discount on all skin care products!
                      </p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/cart"
            className="rounded-full w-9 h-9 flex items-center justify-center bg-black/20 text-white"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
