
import React from "react";
import { Info } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface DescriptionTabProps {
  medicine: {
    fullDescription?: string;
    description?: string;
    saltComposition?: string;
    ingredients?: string[];
    sideEffects?: string[];
  };
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ medicine }) => {
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
};

export default DescriptionTab;
