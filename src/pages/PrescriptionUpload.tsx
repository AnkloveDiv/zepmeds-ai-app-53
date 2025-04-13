import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Image, Upload, Check, AlertCircle, FileText, AlertTriangle, Pill, Phone, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { detectTextFromImage, TextDetectionResult, generateMockResultForTesting } from "@/services/visionService";
import ActionButtons from "@/components/medicine/ActionButtons";
import { toast } from "sonner";

interface Medicine {
  name: string;
  inStock: boolean;
}

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TextDetectionResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [detectionError, setDetectionError] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([]);
  
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      simulateCapture();
    } catch (error) {
      console.error("Error accessing camera:", error);
      uiToast({
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
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        setImage(base64Image);
        
        setAnalysisResult(null);
        setUploadSuccess(false);
        setShowAnalysis(false);
        setDetectionError(false);
        setAnalysisComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateCapture = () => {
    const placeholderImage = "/placeholder.svg";
    setImage(placeholderImage);
    
    setAnalysisResult(null);
    setUploadSuccess(false);
    setShowAnalysis(false);
    setDetectionError(false);
    setAnalysisComplete(false);
  };
  
  const handleProcessPrescription = async () => {
    if (!image) return;
    
    setProcessing(true);
    setDetectionError(false);
    
    try {
      let base64Image = image;
      if (image.startsWith('data:image')) {
        base64Image = image.split(',')[1];
      }
      
      let result: TextDetectionResult;
      if (image === "/placeholder.svg") {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = generateMockResultForTesting();
      } else {
        result = await detectTextFromImage(base64Image);
      }
      
      console.log("Analysis result:", result);
      setAnalysisResult(result);
      setShowAnalysis(true);
      
      const hasMedicines = result.medicineNames && result.medicineNames.length > 0;
      
      if (!result.isPrescription) {
        if (hasMedicines) {
          uiToast({
            title: "Not a formal prescription",
            description: "Found medicine names, but this doesn't appear to be a formal prescription.",
            variant: "default"
          });
        } else {
          uiToast({
            title: "No medicines detected",
            description: "The image doesn't appear to contain any medicine names. Please try another image.",
            variant: "destructive"
          });
          setDetectionError(true);
        }
      } else {
        setUploadSuccess(true);
        uiToast({
          title: "Prescription detected",
          description: "Prescription analyzed successfully",
        });
      }
      
      if (hasMedicines) {
        const medicinesWithStock = result.medicineNames.map(med => ({
          name: med,
          inStock: Math.random() > 0.3
        }));
        setMedicinesList(medicinesWithStock);
      }
      
    } catch (error) {
      console.error("Error processing image:", error);
      uiToast({
        title: "Processing failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive"
      });
      setDetectionError(true);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleUploadPrescription = () => {
    if (analysisComplete) {
      setImage(null);
      setAnalysisResult(null);
      setShowAnalysis(false);
      setUploadSuccess(false);
      setAnalysisComplete(false);
      return;
    }
    
    if (!analysisResult) {
      uiToast({
        title: "No analysis result",
        description: "Please analyze the image first",
        variant: "destructive"
      });
      return;
    }
    
    if (!analysisResult.medicineNames || analysisResult.medicineNames.length === 0) {
      uiToast({
        title: "No medicines found",
        description: "No medicine names were detected in this image. Please try a different image.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setUploadSuccess(true);
      setAnalysisComplete(true);
      
      toast("Prescription Uploaded Successfully", {
        description: "You will receive a call shortly to confirm your order.",
        icon: <Phone className="h-5 w-5 text-green-500" />
      });
      
    }, 1500);
  };
  
  const handleBuyNow = () => {
    if (medicinesList.length === 0) {
      uiToast({
        title: "No medicines to purchase",
        description: "Please upload a prescription with detected medicines",
        variant: "destructive"
      });
      return;
    }
    
    const inStockItems = medicinesList.filter(med => med.inStock);
    
    if (inStockItems.length === 0) {
      toast("No medicines in stock", {
        description: "Sorry, none of the medicines in your prescription are currently in stock",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
      });
      return;
    }
    
    toast("Processing Order", {
      description: `Adding ${inStockItems.length} medicine${inStockItems.length > 1 ? 's' : ''} to cart`,
      icon: <ShoppingCart className="h-5 w-5 text-green-500" />
    });
    
    setTimeout(() => {
      navigate("/medicine-delivery");
    }, 2000);
  };
  
  const getConfidenceLabel = () => {
    if (!analysisResult || !analysisResult.confidence) return "";
    
    if (analysisResult.confidence < 0.3) return "Low confidence";
    if (analysisResult.confidence < 0.7) return "Medium confidence";
    return "High confidence";
  };
  
  const getConfidenceColor = () => {
    if (!analysisResult || !analysisResult.confidence) return "text-gray-400";
    
    if (analysisResult.confidence < 0.3) return "text-red-400";
    if (analysisResult.confidence < 0.7) return "text-yellow-400";
    return "text-green-400";
  };
  
  const hasMedicineNames = analysisResult?.medicineNames && analysisResult.medicineNames.length > 0;
  
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
                
                {detectionError && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="bg-red-500/20 p-3 rounded-full">
                      <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>
                  </div>
                )}
                
                {!uploadSuccess && !detectionError && (
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
          
          {showAnalysis && analysisResult && (
            <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-zepmeds-purple mr-2" />
                  <h4 className="font-medium text-white">
                    {analysisResult.isPrescription ? "Prescription Analysis" : "Text Analysis"}
                  </h4>
                </div>
                {analysisResult.confidence !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full bg-black/30 ${getConfidenceColor()}`}>
                    {getConfidenceLabel()} ({Math.round(analysisResult.confidence * 100)}%)
                  </span>
                )}
              </div>
              
              {analysisResult.isPrescription ? (
                <>
                  <p className="text-green-400 text-sm mb-3">Valid prescription detected</p>
                  
                  {hasMedicineNames ? (
                    <>
                      <p className="text-white text-sm mb-2">Prescribed medications:</p>
                      <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1 mb-3">
                        {analysisResult.medicineNames.map((medicine, index) => {
                          const inStock = medicinesList.find(med => med.name === medicine)?.inStock;
                          return (
                            <li key={index} className="flex items-center justify-between">
                              <span>{medicine}</span>
                              {inStock !== undefined && (
                                <span className={inStock ? "text-green-400 text-xs flex items-center" : "text-red-400 text-xs flex items-center"}>
                                  {inStock ? 
                                    <><CheckCircle className="h-3 w-3 mr-1 text-green-400" /> In Stock</> : 
                                    <><XCircle className="h-3 w-3 mr-1 text-red-400" /> Out of Stock</>}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="text-yellow-400 text-sm mb-3">No specific medicine names were detected in this prescription.</p>
                  )}
                </>
              ) : hasMedicineNames ? (
                <>
                  <div className="flex items-start mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-400 text-sm">
                      This does not appear to be a valid prescription, but medicine names were detected.
                    </p>
                  </div>
                  
                  <p className="text-white text-sm mb-2">Detected medicine names:</p>
                  <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1 mb-3">
                    {analysisResult.medicineNames.map((medicine, index) => {
                      const inStock = medicinesList.find(med => med.name === medicine)?.inStock;
                      return (
                        <li key={index} className="flex items-center justify-between">
                          <span>{medicine}</span>
                          {inStock !== undefined && analysisComplete && (
                            <span className={inStock ? "text-green-400 text-xs flex items-center" : "text-red-400 text-xs flex items-center"}>
                              {inStock ? 
                                <><CheckCircle className="h-3 w-3 mr-1 text-green-400" /> In Stock</> : 
                                <><XCircle className="h-3 w-3 mr-1 text-red-400" /> Out of Stock</>}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">
                    No medicine names were detected. Please upload a clear image of a prescription or a note with medicine names.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className="py-6 border-white/10 hover:bg-white/5"
              onClick={handleCameraCapture}
              disabled={uploadSuccess && !analysisComplete}
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
              disabled={uploadSuccess && !analysisComplete}
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
          
          {image && !showAnalysis && (
            <Button
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light py-3 mb-4"
              onClick={handleProcessPrescription}
              disabled={processing}
            >
              {processing ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Analyze Image</span>
              )}
            </Button>
          )}
          
          {showAnalysis && (
            <ActionButtons 
              onUploadPrescription={handleUploadPrescription}
              hasError={detectionError}
              hasMedicines={hasMedicineNames}
              medicineList={medicinesList}
              onBuyNow={handleBuyNow}
              analysisComplete={analysisComplete}
            />
          )}
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
