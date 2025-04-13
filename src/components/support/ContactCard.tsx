
import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
  delay: number;
}

const ContactCard = ({
  icon,
  title,
  subtitle,
  bgColor,
  iconColor,
  onClick,
  delay,
}: ContactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 glass-morphism rounded-xl flex items-center justify-between"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
          {React.cloneElement(icon as React.ReactElement, { className: `h-5 w-5 ${iconColor}` })}
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </motion.div>
  );
};

export default ContactCard;
