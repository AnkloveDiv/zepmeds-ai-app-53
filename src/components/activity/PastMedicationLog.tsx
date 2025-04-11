
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Eye, AlertCircle, Heart, Brain, Stethoscope, Bone, Sun, Dog, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Medication {
  id: string;
  name: string;
  category: string;
  dateDiscontinued: string;
  reason: string;
}

const PastMedicationLog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [pastMedications, setPastMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Atorvastatin 10mg",
      category: "Supplements",
      dateDiscontinued: "2025-03-15",
      reason: "Doctor prescribed different medication"
    },
    {
      id: "med2",
      name: "Metformin 500mg",
      category: "Supplements",
      dateDiscontinued: "2025-02-28",
      reason: "Side effects reported"
    },
    {
      id: "med3", 
      name: "Amlodipine 5mg",
      category: "Brain",
      dateDiscontinued: "2025-01-10",
      reason: "No longer needed"
    },
    {
      id: "med4",
      name: "Vitamin D3 1000IU",
      category: "Supplements",
      dateDiscontinued: "2025-03-20",
      reason: "Switched to higher dosage"
    },
    {
      id: "med5",
      name: "Retinol Cream",
      category: "Skin Care",
      dateDiscontinued: "2025-03-10",
      reason: "Allergic reaction"
    },
    {
      id: "med6",
      name: "Eye Drops",
      category: "Eye Care",
      dateDiscontinued: "2025-02-15",
      reason: "Condition resolved"
    },
    {
      id: "med7",
      name: "Dental Rinse",
      category: "Dental",
      dateDiscontinued: "2025-01-25",
      reason: "Dentist recommended alternative"
    },
    {
      id: "med8",
      name: "Ibuprofen 400mg",
      category: "Pain Relief",
      dateDiscontinued: "2025-03-05",
      reason: "No longer needed"
    },
    {
      id: "med9",
      name: "Sunscreen SPF 50",
      category: "Summer Care",
      dateDiscontinued: "2025-02-01",
      reason: "Switched to higher SPF"
    },
    {
      id: "med10",
      name: "Flea Treatment",
      category: "Pet Care",
      dateDiscontinued: "2025-03-25",
      reason: "Pet allergy to ingredients"
    },
    {
      id: "med11",
      name: "Blood Pressure Monitor",
      category: "Devices",
      dateDiscontinued: "2025-01-15",
      reason: "Upgraded to newer model"
    },
    {
      id: "med12",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      dateDiscontinued: "2025-04-01",
      reason: "Course completed"
    },
    {
      id: "med13",
      name: "Calcium 1000mg",
      category: "Supplements",
      dateDiscontinued: "2025-03-28",
      reason: "Found better alternative"
    },
    {
      id: "med14",
      name: "Cetirizine 10mg",
      category: "Allergy",
      dateDiscontinued: "2025-02-10",
      reason: "Season changed"
    },
    {
      id: "med15",
      name: "Moisturizing Lotion",
      category: "Skin Care",
      dateDiscontinued: "2025-01-05",
      reason: "Found better product"
    }
  ]);

  const categories = [
    { name: "All", icon: <Pill className="h-5 w-5" /> },
    { name: "Skin Care", icon: <Heart className="h-5 w-5" /> },
    { name: "Supplements", icon: <Pill className="h-5 w-5" /> },
    { name: "Eye Care", icon: <Eye className="h-5 w-5" /> },
    { name: "Dental", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Pain Relief", icon: <Bone className="h-5 w-5" /> },
    { name: "Brain", icon: <Brain className="h-5 w-5" /> },
    { name: "Summer Care", icon: <Sun className="h-5 w-5" /> },
    { name: "Pet Care", icon: <Dog className="h-5 w-5" /> },
    { name: "Devices", icon: <Thermometer className="h-5 w-5" /> }
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Skin Care': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'Supplements': return <Pill className="h-5 w-5 text-blue-500" />;
      case 'Eye Care': return <Eye className="h-5 w-5 text-cyan-500" />;
      case 'Dental': return <Stethoscope className="h-5 w-5 text-purple-500" />;
      case 'Pain Relief': return <Bone className="h-5 w-5 text-orange-500" />;
      case 'Brain': return <Brain className="h-5 w-5 text-violet-500" />;
      case 'Summer Care': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'Pet Care': return <Dog className="h-5 w-5 text-green-500" />;
      case 'Devices': return <Thermometer className="h-5 w-5 text-indigo-500" />;
      case 'Allergy': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Pill className="h-5 w-5 text-red-500" />;
    }
  };

  const filteredMedications = activeCategory === "All" 
    ? pastMedications 
    : pastMedications.filter(med => med.category === activeCategory);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-white">Past Medications</h3>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/past-medicines')}
          className="text-zepmeds-purple border-zepmeds-purple"
        >
          View All
        </Button>
      </div>
      
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 mb-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              className={`px-4 py-2 rounded-full flex items-center space-x-1 min-w-max ${
                category.name === activeCategory
                  ? "bg-zepmeds-purple text-white"
                  : "bg-black/20 border border-white/10 text-gray-300"
              }`}
              onClick={() => setActiveCategory(category.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={category.name === activeCategory ? "text-white" : "text-gray-400"}>
                {category.icon}
              </span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredMedications.slice(0, 5).map((med, index) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-lg p-3"
          >
            <div className="flex items-start">
              <div className="bg-red-500/10 rounded-lg p-2 mr-3">
                {getCategoryIcon(med.category)}
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
