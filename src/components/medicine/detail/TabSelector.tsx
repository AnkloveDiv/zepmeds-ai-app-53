
import React from "react";

interface TabSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-none">
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          activeTab === "description"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => setActiveTab("description")}
      >
        Description
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          activeTab === "directions"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => setActiveTab("directions")}
      >
        Directions
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          activeTab === "howItWorks"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => setActiveTab("howItWorks")}
      >
        How it Works
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          activeTab === "quickTips"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => setActiveTab("quickTips")}
      >
        Quick Tips
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          activeTab === "faqs"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => setActiveTab("faqs")}
      >
        FAQs
      </button>
    </div>
  );
};

export default TabSelector;
