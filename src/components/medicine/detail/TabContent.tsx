
import React from "react";
import { MedicineType } from "./utils/detectMedicineType";
import {
  DescriptionTab,
  DirectionsTab,
  HowItWorksTab,
  QuickTipsTab,
  FAQsTab
} from "./tabs";

interface TabContentProps {
  activeTab: string;
  medicine: {
    fullDescription?: string;
    description?: string;
    saltComposition?: string;
    ingredients?: string[];
    sideEffects?: string[];
    directions?: string;
    dosage?: string;
    howItWorks?: string;
    quickTips?: string[];
    faqs?: { question: string; answer: string }[];
    name: string;
  };
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, medicine }) => {
  // Use the detectMedicineType from utils to determine the medicine type
  const medicineType = getMedicineType(medicine.name);
  
  if (activeTab === "description") {
    return <DescriptionTab medicine={medicine} />;
  }
  
  if (activeTab === "directions") {
    return <DirectionsTab medicine={medicine} />;
  }
  
  if (activeTab === "howItWorks") {
    return <HowItWorksTab medicine={medicine} medicineType={medicineType} />;
  }
  
  if (activeTab === "quickTips") {
    return <QuickTipsTab medicine={medicine} medicineType={medicineType} />;
  }
  
  if (activeTab === "faqs") {
    return <FAQsTab medicine={medicine} />;
  }
  
  return null;
};

// Helper function to determine medicine type
// This is temporary until we refactor to use the proper utility
const getMedicineType = (medicineName: string): MedicineType => {
  const lowerName = medicineName.toLowerCase();
  
  if (lowerName.includes("solution") || 
      lowerName.includes("gel") || 
      lowerName.includes("drops") ||
      lowerName.includes("cream") ||
      lowerName.includes("syrup") ||
      lowerName.includes("liquid") ||
      lowerName.includes("lotion")) {
    return "liquid";
  } else if (lowerName.includes("monitor") || 
            lowerName.includes("thermometer") ||
            lowerName.includes("device") ||
            lowerName.includes("machine") ||
            lowerName.includes("meter") ||
            lowerName.includes("tester") ||
            lowerName.includes("glasses")) {
    return "device";
  } else {
    return "tablets";
  }
};

export default TabContent;
