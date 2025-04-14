
import React from 'react';
import { Button } from "@/components/ui/button";

interface PrescriptionUploadBannerProps {
  onUploadClick: () => void;
}

const PrescriptionUploadBanner = ({ onUploadClick }: PrescriptionUploadBannerProps) => {
  return (
    <div className="mt-4 p-4 bg-[#1a1a1a] rounded-xl flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="8" r="1" fill="white"/>
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium">Add prescription and our</p>
          <p className="text-white text-sm font-medium">pharmacist will assist you!</p>
        </div>
      </div>
      <Button 
        variant="default" 
        className="bg-[#3b5cf5] hover:bg-blue-600 text-white px-6"
        onClick={onUploadClick}
      >
        Upload
      </Button>
    </div>
  );
};

export default PrescriptionUploadBanner;
