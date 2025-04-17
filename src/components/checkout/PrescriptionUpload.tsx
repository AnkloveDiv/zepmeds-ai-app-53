
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileUpIcon, CheckCircle, AlertCircle } from "lucide-react";
import { uploadPrescription } from '@/services/prescriptionService';
import { useToast } from '@/components/ui/use-toast';

interface PrescriptionUploadProps {
  onPrescriptionUploaded: (url: string) => void;
}

const PrescriptionUpload = ({ onPrescriptionUploaded }: PrescriptionUploadProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a prescription file to upload",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Prescription file must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PNG, JPEG, and PDF files are accepted",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const prescriptionUrl = await uploadPrescription(file);
      
      toast({
        title: "Upload successful",
        description: "Your prescription has been uploaded successfully",
      });
      
      setUploadSuccess(true);
      onPrescriptionUploaded(prescriptionUrl);
    } catch (error) {
      console.error('Error uploading prescription:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="border border-gray-700 rounded-xl p-4 bg-black/30">
      <div className="flex items-start space-x-3">
        {uploadSuccess ? (
          <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
        ) : (
          <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
        )}
        
        <div className="flex-1">
          <h3 className="text-white font-medium">Prescription Required</h3>
          <p className="text-gray-400 text-sm mb-3">Some items in your cart require a valid prescription</p>
          
          <input
            type="file"
            ref={fileInputRef}
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file ? (
            <div>
              <div className="bg-gray-800 rounded p-2 text-sm text-gray-300 flex justify-between items-center mb-3">
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={browseFiles}
                  className="border-gray-700 text-gray-300"
                >
                  Change File
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading || uploadSuccess}
                  className={uploadSuccess ? "bg-green-600 hover:bg-green-700" : "bg-zepmeds-purple hover:bg-zepmeds-purple/90"}
                >
                  {uploading ? "Uploading..." : uploadSuccess ? "Uploaded" : "Upload Prescription"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={browseFiles}
              className="border-gray-700 text-gray-300 w-full"
            >
              <FileUpIcon className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          )}
          
          <p className="text-xs text-gray-500 mt-3">
            Upload PNG, JPEG, or PDF files only. Max file size: 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
