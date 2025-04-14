
import React from "react";
import { Droplets, ThermometerSun, Pill } from "lucide-react";
import { MedicineType } from "../utils/detectMedicineType";

interface HowItWorksTabProps {
  medicine: {
    name: string;
    howItWorks?: string;
  };
  medicineType: MedicineType;
}

const HowItWorksTab: React.FC<HowItWorksTabProps> = ({ medicine, medicineType }) => {
  const isLiquid = medicineType === "liquid";
  const isDevice = medicineType === "device";

  return (
    <div>
      <h3 className="text-white font-medium flex items-center gap-2 mb-2">
        {isLiquid ? (
          <Droplets className="h-4 w-4" />
        ) : isDevice ? (
          <ThermometerSun className="h-4 w-4" />
        ) : (
          <Pill className="h-4 w-4" />
        )}
        How it Works
      </h3>
      <div className="text-sm text-gray-300">
        {medicine.howItWorks || (isLiquid 
          ? "This solution works by direct application to the affected area to provide relief." 
          : isDevice 
            ? "This device helps monitor and track your health metrics with precision." 
            : "This medicine works by targeting specific receptors in the body to provide relief.")}
      </div>
    </div>
  );
};

export default HowItWorksTab;
