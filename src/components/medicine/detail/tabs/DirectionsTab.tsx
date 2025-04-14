
import React from "react";
import { ScrollText } from "lucide-react";

interface DirectionsTabProps {
  medicine: {
    directions?: string;
    dosage?: string;
  };
}

const DirectionsTab: React.FC<DirectionsTabProps> = ({ medicine }) => {
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
};

export default DirectionsTab;
