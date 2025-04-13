
import React from "react";
import { 
  Info, 
  ScrollText, 
  Pill, 
  ArrowRight, 
  CircleHelp, 
  Droplets, 
  ThermometerSun,
  ChevronDown 
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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
  const isLiquid = medicine.name.toLowerCase().includes("solution") || 
                  medicine.name.toLowerCase().includes("gel") || 
                  medicine.name.toLowerCase().includes("drops") ||
                  medicine.name.toLowerCase().includes("cream") ||
                  medicine.name.toLowerCase().includes("lotion");
                  
  const isDevice = medicine.name.toLowerCase().includes("monitor") || 
                  medicine.name.toLowerCase().includes("thermometer") ||
                  medicine.name.toLowerCase().includes("glasses");

  if (activeTab === "description") {
    return (
      <div className="space-y-3">
        <h3 className="text-white font-medium flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          Description
        </h3>
        <p className="text-sm text-gray-300">{medicine.fullDescription || medicine.description || "No description available."}</p>
        
        {medicine.saltComposition && (
          <Accordion type="single" collapsible className="border-gray-800 pt-2">
            <AccordionItem value="saltComposition" className="border-gray-800">
              <AccordionTrigger className="text-white text-sm font-medium py-2">
                Salt Composition
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300">
                {medicine.saltComposition}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {medicine.ingredients && medicine.ingredients.length > 0 && (
          <Accordion type="single" collapsible className="border-gray-800">
            <AccordionItem value="ingredients" className="border-gray-800">
              <AccordionTrigger className="text-white text-sm font-medium py-2">
                Ingredients
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-sm text-gray-300 pl-2">
                  {medicine.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="mb-1">{ingredient}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {medicine.sideEffects && medicine.sideEffects.length > 0 && (
          <Accordion type="single" collapsible className="border-gray-800">
            <AccordionItem value="sideEffects" className="border-gray-800">
              <AccordionTrigger className="text-white text-sm font-medium py-2">
                Side Effects
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-sm text-gray-300 pl-2">
                  {medicine.sideEffects.map((effect, idx) => (
                    <li key={idx} className="mb-1">{effect}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    );
  }
  
  if (activeTab === "directions") {
    return (
      <div>
        <h3 className="text-white font-medium flex items-center gap-2 mb-2">
          <ScrollText className="h-4 w-4" />
          Directions of Use
        </h3>
        <div className="text-sm text-gray-300">
          {medicine.directions || medicine.dosage || "Take as directed by your physician."}
        </div>
      </div>
    );
  }
  
  if (activeTab === "howItWorks") {
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
  }
  
  if (activeTab === "quickTips") {
    return (
      <div>
        <h3 className="text-white font-medium flex items-center gap-2 mb-2">
          <ArrowRight className="h-4 w-4" />
          Quick Tips
        </h3>
        {medicine.quickTips && medicine.quickTips.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-300 pl-2 space-y-1">
            {medicine.quickTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        ) : (
          <ul className="list-disc list-inside text-sm text-gray-300 pl-2 space-y-1">
            <li>Store in a cool, dry place away from direct sunlight</li>
            <li>Keep out of reach of children</li>
            <li>Do not use after expiry date</li>
            {isLiquid && <li>Shake well before use</li>}
          </ul>
        )}
      </div>
    );
  }
  
  if (activeTab === "faqs") {
    return (
      <div>
        <h3 className="text-white font-medium flex items-center gap-2 mb-2">
          <CircleHelp className="h-4 w-4" />
          Frequently Asked Questions
        </h3>
        
        <Accordion type="single" collapsible className="w-full border-gray-800">
          {medicine.faqs && medicine.faqs.length > 0 ? (
            <>
              {medicine.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-gray-800">
                  <AccordionTrigger className="text-white text-sm font-medium py-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          ) : (
            <>
              <AccordionItem value="faq-1" className="border-gray-800">
                <AccordionTrigger className="text-white text-sm font-medium py-2">
                  Is this medicine safe for long-term use?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Consult with your doctor for long-term use recommendations.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-2" className="border-gray-800">
                <AccordionTrigger className="text-white text-sm font-medium py-2">
                  Can I take this with other medications?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Always inform your doctor about all medications you are taking.
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </div>
    );
  }
  
  return null;
};

export default TabContent;
