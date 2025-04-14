
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, ScrollText, Pill } from "lucide-react";
import { 
  DescriptionTab, 
  DirectionsTab, 
  HowItWorksTab 
} from "../tabs";

interface MedicineTabsProps {
  medicine: {
    name: string;
    description?: string;
    fullDescription?: string;
    manufacturer?: string;
    expiryDate?: string;
    dosage?: string;
    sideEffects?: string[];
    ingredients?: string[];
    saltComposition?: string;
    howItWorks?: string;
    directions?: string;
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
  return (
    <div className="flex-1 overflow-hidden">
      <Tabs defaultValue="description" className="w-full">
        <div className="sticky top-0 z-10 p-2 bg-gray-900/70 border-b border-gray-800">
          <TabsList className="w-full h-auto bg-gray-900/50 p-1">
            <TabsTrigger 
              value="description" 
              className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
              onClick={() => setActiveTab("description")}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Description</span>
            </TabsTrigger>
            <TabsTrigger 
              value="directions" 
              className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
              onClick={() => setActiveTab("directions")}
            >
              <ScrollText className="h-3.5 w-3.5" />
              <span>Directions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="howItWorks" 
              className="flex items-center gap-1 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
              onClick={() => setActiveTab("howItWorks")}
            >
              <Pill className="h-3.5 w-3.5" />
              <span>How it Works</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="h-48 px-4 py-3">
          <TabsContent value="description" className="m-0">
            <DescriptionTab medicine={medicine} />
          </TabsContent>
          <TabsContent value="directions" className="m-0">
            <DirectionsTab medicine={medicine} />
          </TabsContent>
          <TabsContent value="howItWorks" className="m-0">
            <HowItWorksTab medicine={medicine} medicineType={detectMedicineType(medicine.name)} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

// Import at the top of the file
import { detectMedicineType } from "../utils/detectMedicineType";

export default MedicineTabs;
