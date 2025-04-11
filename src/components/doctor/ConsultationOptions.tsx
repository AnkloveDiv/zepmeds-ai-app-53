
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";

interface ConsultationOptionsProps {
  onBookAppointment: () => void;
  onInstantConsultation: () => void;
}

const ConsultationOptions = ({ onBookAppointment, onInstantConsultation }: ConsultationOptionsProps) => {
  return (
    <>
      <motion.div 
        className="glass-morphism rounded-xl p-4 mb-6 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={onBookAppointment}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium">Book Appointment</h3>
              <p className="text-gray-400 text-sm">Schedule at your convenience</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4 mb-6 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={onInstantConsultation}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-zepmeds-purple/10 flex items-center justify-center mr-3 text-zepmeds-purple">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium">Instant Consultation</h3>
              <p className="text-gray-400 text-sm">Connect with available doctors</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </motion.div>
    </>
  );
};

export default ConsultationOptions;
