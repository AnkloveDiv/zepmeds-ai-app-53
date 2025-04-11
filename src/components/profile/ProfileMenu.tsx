
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface MenuItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  bgColor?: string;
}

interface ProfileMenuProps {
  menuItems: MenuItem[];
}

const ProfileMenu = ({ menuItems }: ProfileMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.3 }}
        >
          <button
            className="w-full glass-morphism rounded-xl p-4 flex items-center justify-between hover:border-white/40 transition-colors"
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center">
              <div className={`w-9 h-9 rounded-full ${item.bgColor || "bg-white/10"} flex items-center justify-center mr-3`}>
                {item.icon}
              </div>
              <span className="text-white font-medium">{item.title}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileMenu;
