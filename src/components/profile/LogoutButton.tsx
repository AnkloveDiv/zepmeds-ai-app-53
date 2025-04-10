
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <button
        className="w-full glass-morphism rounded-xl p-4 flex items-center justify-between hover:border-red-500/40 transition-colors mt-4"
        onClick={handleLogout}
      >
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center mr-3 text-red-500">
            <LogOut size={20} />
          </div>
          <span className="text-red-500 font-medium">Logout</span>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>
    </motion.div>
  );
};

export default LogoutButton;
