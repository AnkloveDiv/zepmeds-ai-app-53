
import React from "react";
import { detectMedicineType } from "./utils/detectMedicineType";
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
  // Determine the medicine type from the name
  const medicineType = detectMedicineType(medicine.name);
  
  switch (activeTab) {
    case "description":
      return <DescriptionTab medicine={medicine} />;
    
    case "directions":
      return <DirectionsTab medicine={medicine} />;
    
    case "howItWorks":
      return <HowItWorksTab medicine={medicine} medicineType={medicineType} />;
    
    case "quickTips":
      return <QuickTipsTab medicine={medicine} medicineType={medicineType} />;
    
    case "faqs":
      return <FAQsTab medicine={medicine} />;
    
    default:
      return <DescriptionTab medicine={medicine} />;
  }
};

export default TabContent;
