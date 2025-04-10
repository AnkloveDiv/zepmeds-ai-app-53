
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
  className?: string;
}

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  onClick,
  className
}: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass-morphism p-4 cursor-pointer card-glow",
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div 
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${color}`}
        >
          {icon}
        </div>
        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-xl"
        style={{ background: `linear-gradient(to bottom right, ${color}, transparent)` }}
      />
    </motion.div>
  );
};

export default ServiceCard;
