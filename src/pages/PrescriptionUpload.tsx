
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Image, Upload, Check, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real app, you would implement camera capture UI here
      // For this example, we'll just simulate success
      stream.getTracks().forEach(track => track.stop());
      
      // Simulate capturing an image
      simulateCapture();
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to capture your prescription",
        variant: "destructive"
      });
    }
  };
  
  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateCapture = () => {
    // For demo purposes, use a placeholder image
    setImage("/placeholder.svg");
  };
  
  const handleUploadPrescription = () => {
    if (!image) return;
    
    setProcessing(true);
    
    // Simulate processing delay (in a real app, this would be an API call)
    setTimeout(() => {
      setProcessing(false);
      setUploadSuccess(true);
      
      toast({
        title: "Prescription uploaded",
        description: "Your prescription has been processed successfully",
      });
      
      // Simulate navigating to medicine list after another delay
      setTimeout(() => {
        navigate("/medicine-delivery");
      }, 2000);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Upload Prescription" />
      
      <main className="px-4 py-4">
        <div className="glass-morphism rounded-xl p-5 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Upload Your Prescription</h3>
          <p className="text-gray-400 mb-6">Get your medicines delivered based on your prescription</p>
          
          <div className="mb-8">
            {image ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <img 
                  src={image} 
                  alt="Prescription" 
                  className="w-full h-64 object-contain border border-white/10 rounded-lg"
                />
                
                {uploadSuccess && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="bg-green-500/20 p-3 rounded-full">
                      <Check className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                )}
                
                {!uploadSuccess && (
                  <Button
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-2 h-auto"
                    onClick={() => setImage(null)}
                  >
                    <AlertCircle className="h-5 w-5 text-white" />
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="border-2 border-dashed border-white/20 rounded-lg h-64 flex flex-col items-center justify-center">
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-white mb-1">Drop your prescription here</p>
                <p className="text-gray-400 text-sm mb-6">or use one of the options below</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className="py-6 border-white/10 hover:bg-white/5"
              onClick={handleCameraCapture}
              disabled={uploadSuccess}
            >
              <div className="flex flex-col items-center">
                <Camera className="h-6 w-6 text-zepmeds-purple mb-2" />
                <span className="text-white">Camera</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="py-6 border-white/10 hover:bg-white/5"
              onClick={handleGalleryUpload}
              disabled={uploadSuccess}
            >
              <div className="flex flex-col items-center">
                <Image className="h-6 w-6 text-zepmeds-purple mb-2" />
                <span className="text-white">Gallery</span>
              </div>
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <Button
            className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light py-3"
            onClick={handleUploadPrescription}
            disabled={!image || processing || uploadSuccess}
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Processed Successfully</span>
              </div>
            ) : (
              <span>Upload Prescription</span>
            )}
          </Button>
        </div>
        
        <div className="glass-morphism rounded-xl p-5">
          <h3 className="text-lg font-medium text-white mb-2">Prescription Guidelines</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Ensure the prescription is clear and legible</li>
            <li>• Make sure the doctor's signature is visible</li>
            <li>• Include all pages if the prescription has multiple pages</li>
            <li>• Prescriptions should be recent (not older than 6 months)</li>
            <li>• Make sure the patient's name is clearly visible</li>
          </ul>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PrescriptionUpload;
