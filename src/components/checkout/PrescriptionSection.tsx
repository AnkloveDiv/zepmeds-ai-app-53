
import React from "react";
import { Shield } from "lucide-react";
import PrescriptionUpload from "./PrescriptionUpload";

interface PrescriptionSectionProps {
  onPrescriptionUploaded: (url: string) => void;
}

const PrescriptionSection = ({ onPrescriptionUploaded }: PrescriptionSectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <Shield className="mr-2 text-red-400" size={20} />
        Prescription Required
      </h2>
      <PrescriptionUpload onPrescriptionUploaded={onPrescriptionUploaded} />
    </div>
  );
};

export default PrescriptionSection;
