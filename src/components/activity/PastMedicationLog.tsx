
import React, { useState, useEffect } from "react";
import { Pill, Eye, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Medication {
  id: string;
  name: string;
  category: string;
  dateDiscontinued: string;
  reason: string;
}

const PastMedicationLog = () => {
  const [pastMedications, setPastMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Atorvastatin 10mg",
      category: "Cholesterol",
      dateDiscontinued: "2025-03-15",
      reason: "Doctor prescribed different medication"
    },
    {
      id: "med2",
      name: "Metformin 500mg",
      category: "Diabetes",
      dateDiscontinued: "2025-02-28",
      reason: "Side effects reported"
    },
    {
      id: "med3", 
      name: "Amlodipine 5mg",
      category: "Blood Pressure",
      dateDiscontinued: "2025-01-10",
      reason: "No longer needed"
    },
    {
      id: "med4",
      name: "Vitamin D3 1000IU",
      category: "Supplement",
      dateDiscontinued: "2025-03-20",
      reason: "Switched to higher dosage"
    }
  ]);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold text-white">Past Medications</h3>
      </div>
      
      <div className="space-y-3">
        {pastMedications.map((med, index) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-lg p-3"
          >
            <div className="flex items-start">
              <div className="bg-red-500/10 rounded-lg p-2 mr-3">
                <Pill className="h-5 w-5 text-red-500" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium">{med.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="bg-gray-700 text-xs text-gray-300 px-2 py-0.5 rounded-full">
                    {med.category}
                  </span>
                  <span className="text-gray-400 text-xs ml-3">
                    Discontinued: {new Date(med.dateDiscontinued).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Reason: {med.reason}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PastMedicationLog;
