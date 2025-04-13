
import React from "react";
import { Info, ScrollText, Pill, ArrowRight, CircleHelp } from "lucide-react";

interface TabSelectorProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "description", label: "Description", icon: <Info className="h-4 w-4" /> },
    { id: "directions", label: "Directions", icon: <ScrollText className="h-4 w-4" /> },
    { id: "howItWorks", label: "How it Works", icon: <Pill className="h-4 w-4" /> },
    { id: "quickTips", label: "Quick Tips", icon: <ArrowRight className="h-4 w-4" /> },
    { id: "faqs", label: "FAQs", icon: <CircleHelp className="h-4 w-4" /> },
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-none -mx-4 px-4 pb-4">
      <div className="flex space-x-2 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center rounded-full px-2 py-1.5 text-xs font-medium whitespace-nowrap sm:px-3 ${
              activeTab === tab.id
                ? "bg-zepmeds-purple text-white"
                : "bg-black/20 text-gray-400 hover:bg-black/40 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-1 sm:mr-1.5">{tab.icon}</span>
            <span className="hidden xs:inline">{tab.label}</span>
            <span className="xs:hidden">{tab.label.substring(0, 3)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSelector;
