
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

interface AudioConsultationOptionProps {
  onClick: () => void;
}

const AudioConsultationOption = ({ onClick }: AudioConsultationOptionProps) => {
  return (
    <motion.div 
      className="glass-morphism rounded-xl p-4 mb-6 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium">Voice Consultation</h3>
            <p className="text-gray-400 text-sm">Call doctors directly</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioConsultationOption;
