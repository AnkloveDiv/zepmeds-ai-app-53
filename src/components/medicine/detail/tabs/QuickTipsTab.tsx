
import React from "react";
import { ArrowRight } from "lucide-react";
import { MedicineType } from "../utils/detectMedicineType";

interface QuickTipsTabProps {
  medicine: {
    quickTips?: string[];
  };
  medicineType: MedicineType;
}

const QuickTipsTab: React.FC<QuickTipsTabProps> = ({ medicine, medicineType }) => {
  const isLiquid = medicineType === "liquid";

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
};

export default QuickTipsTab;
