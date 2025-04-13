
import { motion } from "framer-motion";
import { FileUp, Filter, AlertTriangle, Pill, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Medicine {
  name: string;
  inStock: boolean;
}

interface ActionButtonsProps {
  onUploadPrescription: () => void;
  hasError?: boolean;
  hasMedicines?: boolean;
  medicineList?: Medicine[];
  onBuyNow?: () => void;
  analysisComplete?: boolean;
}

const ActionButtons = ({ 
  onUploadPrescription, 
  hasError, 
  hasMedicines, 
  medicineList, 
  onBuyNow,
  analysisComplete 
}: ActionButtonsProps) => {
  
  const handleUpload = () => {
    if (analysisComplete) {
      // Notify user about follow-up call
      toast("Prescription Uploaded Successfully", {
        description: "You will receive a call shortly to confirm your order.",
      });
      
      // Show stock status when prescription is successfully uploaded
      if (medicineList && medicineList.length > 0) {
        setTimeout(() => {
          const inStockItems = medicineList.filter(med => med.inStock);
          const outOfStockItems = medicineList.filter(med => !med.inStock);
          
          if (inStockItems.length > 0) {
            toast(`${inStockItems.length} Medicine${inStockItems.length > 1 ? 's' : ''} in Stock`, {
              description: inStockItems.map(med => med.name).join(", "),
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            });
          }
          
          if (outOfStockItems.length > 0) {
            toast(`${outOfStockItems.length} Medicine${outOfStockItems.length > 1 ? 's' : ''} Not in Stock`, {
              description: outOfStockItems.map(med => med.name).join(", "),
              icon: <XCircle className="h-5 w-5 text-red-500" />,
            });
          }
        }, 1000);
      }
    } else {
      toast("Smart Prescription Analysis", {
        description: "Our AI can extract and analyze medicines from your prescription image",
      });
    }
    
    onUploadPrescription();
  };
  
  return (
    <div className="flex justify-between items-center mt-6 mb-4">
      {!analysisComplete ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 ${hasError ? 'bg-amber-600' : hasMedicines ? 'bg-green-600' : 'bg-zepmeds-purple'} text-white rounded-lg flex items-center`}
          onClick={handleUpload}
        >
          {hasError ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2 text-white" />
              Try Again
            </>
          ) : hasMedicines ? (
            <>
              <Pill className="h-4 w-4 mr-2 text-white" />
              Use Detected Medicines
            </>
          ) : (
            <>
              <FileUp className="h-4 w-4 mr-2 text-white" />
              Upload Prescription
            </>
          )}
        </motion.button>
      ) : (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-zepmeds-purple text-white rounded-lg flex items-center"
            onClick={handleUpload}
          >
            <FileUp className="h-4 w-4 mr-2 text-white" />
            Upload Another
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
            onClick={onBuyNow}
          >
            <ShoppingCart className="h-4 w-4 mr-2 text-white" />
            Buy Now
          </motion.button>
        </div>
      )}

      <button className="p-2 rounded-lg bg-black/20 border border-white/10">
        <Filter className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default ActionButtons;
