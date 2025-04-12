
import { motion } from "framer-motion";
import { FileUp, Filter, AlertTriangle, Pill } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ActionButtonsProps {
  onUploadPrescription: () => void;
  hasError?: boolean;
  hasMedicines?: boolean;
}

const ActionButtons = ({ onUploadPrescription, hasError, hasMedicines }: ActionButtonsProps) => {
  const { toast } = useToast();
  
  const handleUpload = () => {
    toast({
      title: "Smart Prescription Analysis",
      description: "Our AI can extract and analyze medicines from your prescription image",
    });
    onUploadPrescription();
  };
  
  return (
    <div className="flex justify-between items-center mt-6 mb-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 ${hasError ? 'bg-amber-600' : hasMedicines ? 'bg-green-600' : 'bg-zepmeds-purple'} text-white rounded-lg flex items-center`}
        onClick={handleUpload}
      >
        {hasError ? (
          <>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Try Again
          </>
        ) : hasMedicines ? (
          <>
            <Pill className="h-4 w-4 mr-2" />
            Use Detected Medicines
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4 mr-2" />
            Upload Prescription
          </>
        )}
      </motion.button>

      <button className="p-2 rounded-lg bg-black/20 border border-white/10">
        <Filter className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default ActionButtons;
