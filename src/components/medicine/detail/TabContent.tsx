
import React from "react";
import { Info, ScrollText, Pill, ArrowRight, CircleHelp, Droplets, ThermometerSun } from "lucide-react";

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
      <div>
        <h3 className="text-white font-medium flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" />
          Description
        </h3>
        <p className="text-sm text-gray-300">{medicine.fullDescription || medicine.description || "No description available."}</p>
        
        {medicine.saltComposition && (
          <div className="mt-4">
            <h4 className="text-white text-sm font-medium mb-1">Salt Composition:</h4>
            <p className="text-sm text-gray-300">{medicine.saltComposition}</p>
          </div>
        )}
        
        {medicine.ingredients && medicine.ingredients.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white text-sm font-medium mb-1">Ingredients:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {medicine.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicine.sideEffects && medicine.sideEffects.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white text-sm font-medium mb-1">Side Effects:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {medicine.sideEffects.map((effect, idx) => (
                <li key={idx}>{effect}</li>
              ))}
            </ul>
          </div>
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
        <p className="text-sm text-gray-300">
          {medicine.directions || medicine.dosage || "Take as directed by your physician."}
        </p>
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
        <p className="text-sm text-gray-300">
          {medicine.howItWorks || (isLiquid 
            ? "This solution works by direct application to the affected area to provide relief." 
            : isDevice 
              ? "This device helps monitor and track your health metrics with precision." 
              : "This medicine works by targeting specific receptors in the body to provide relief.")}
        </p>
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
          <ul className="list-disc list-inside text-sm text-gray-300">
            {medicine.quickTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        ) : (
          <ul className="list-disc list-inside text-sm text-gray-300">
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
        {medicine.faqs && medicine.faqs.length > 0 ? (
          <div className="space-y-3">
            {medicine.faqs.map((faq, idx) => (
              <div key={idx}>
                <h4 className="text-white text-sm font-medium">{faq.question}</h4>
                <p className="text-sm text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h4 className="text-white text-sm font-medium">Is this medicine safe for long-term use?</h4>
              <p className="text-sm text-gray-300">Consult with your doctor for long-term use recommendations.</p>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">Can I take this with other medications?</h4>
              <p className="text-sm text-gray-300">Always inform your doctor about all medications you are taking.</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export default TabContent;
