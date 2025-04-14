
import React from "react";
import { CircleHelp } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface FAQsTabProps {
  medicine: {
    faqs?: { question: string; answer: string }[];
  };
}

const FAQsTab: React.FC<FAQsTabProps> = ({ medicine }) => {
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
};

export default FAQsTab;
