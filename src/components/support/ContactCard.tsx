
import React from "react";
import { motion } from "framer-motion";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
  delay?: number;
  badge?: string;
}

const ContactCard = ({ 
  icon, 
  title, 
  subtitle, 
  bgColor, 
  iconColor, 
  onClick, 
  delay = 0,
  badge
}: ContactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${bgColor} rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity relative`}
      onClick={onClick}
    >
      <div className={`p-3 rounded-full ${iconColor} bg-black/20 mr-4`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <h3 className="text-white font-medium">{title}</h3>
          {badge && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-md">
              {badge}
            </span>
          )}
        </div>
        <p className="text-white/70 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default ContactCard;
