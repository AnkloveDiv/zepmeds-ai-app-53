
import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MedicineTabsProps {
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
  };
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const MedicineTabs: React.FC<MedicineTabsProps> = ({ 
  medicine,
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    { id: "description", label: "Key information" },
    { id: "directions", label: "Directions of use" },
    { id: "howItWorks", label: "How it works" },
    { id: "quickTips", label: "Quick tips" },
    { id: "faqs", label: "FAQs" },
  ];

  return (
    <div className="bg-black px-4 py-2 flex-1 overflow-y-auto">
      <div className="space-y-3">
        {tabs.map((tab) => (
          <Collapsible 
            key={tab.id}
            className="w-full border border-gray-800 rounded-lg overflow-hidden"
            open={activeTab === tab.id}
            onOpenChange={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 text-left text-white">
              <span>{tab.label}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${activeTab === tab.id ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-gray-300 bg-gray-900/30 border-t border-gray-800">
              {tab.id === "description" && medicine.fullDescription ? (
                <p>{medicine.fullDescription}</p>
              ) : tab.id === "directions" && medicine.directions ? (
                <p>{medicine.directions}</p>
              ) : tab.id === "howItWorks" && medicine.howItWorks ? (
                <p>{medicine.howItWorks}</p>
              ) : tab.id === "quickTips" && medicine.quickTips ? (
                <ul className="list-disc pl-5 space-y-1">
                  {medicine.quickTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              ) : tab.id === "faqs" && medicine.faqs ? (
                <div className="space-y-3">
                  {medicine.faqs.map((faq, idx) => (
                    <div key={idx}>
                      <p className="font-semibold">{faq.question}</p>
                      <p className="mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No information available</p>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default MedicineTabs;
