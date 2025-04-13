
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, MessageSquare } from "lucide-react";
import ContactCard from "./ContactCard";
import FAQAccordion from "./FAQAccordion";
import { faqs } from "./data/faqData";

interface MainSupportViewProps {
  onOpenChat: () => void;
}

const MainSupportView = ({ onOpenChat }: MainSupportViewProps) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">How can we help you?</h2>
        
        <div className="grid gap-4">
          <ContactCard 
            icon={<MessageCircle />}
            title="AI Chat Support"
            subtitle="Get instant help from our AI"
            bgColor="bg-zepmeds-purple/20"
            iconColor="text-zepmeds-purple"
            onClick={onOpenChat}
            delay={0.1}
          />
          
          <ContactCard 
            icon={<MessageSquare />}
            title="Live Chat with Agent"
            subtitle="Talk to a real person"
            bgColor="bg-indigo-500/20"
            iconColor="text-indigo-400"
            onClick={onOpenChat}
            delay={0.15}
            badge="New"
          />
          
          <ContactCard 
            icon={<Phone />}
            title="Call Support"
            subtitle="24/7 Helpline: 1234-567-890"
            bgColor="bg-green-500/20"
            iconColor="text-green-500"
            onClick={() => window.location.href = "tel:+911234567890"}
            delay={0.2}
          />
          
          <ContactCard 
            icon={<Mail />}
            title="Email Support"
            subtitle="support@zepmeds.com"
            bgColor="bg-blue-500/20"
            iconColor="text-blue-500"
            onClick={() => window.location.href = "mailto:support@zepmeds.com"}
            delay={0.3}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">FAQs</h2>
        <FAQAccordion faqs={faqs} />
      </div>
    </>
  );
};

export default MainSupportView;
