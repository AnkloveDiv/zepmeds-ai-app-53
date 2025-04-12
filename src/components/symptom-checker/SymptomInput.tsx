
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface SymptomInputProps {
  symptoms: string[];
  setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  additionalInfo: string;
  setAdditionalInfo: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze: () => void;
}

const SymptomInput: React.FC<SymptomInputProps> = ({
  symptoms,
  setSymptoms,
  additionalInfo,
  setAdditionalInfo,
  onAnalyze,
}) => {
  const { toast } = useToast();
  const [currentSymptom, setCurrentSymptom] = useState("");

  const addSymptom = () => {
    if (currentSymptom.trim() !== "" && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    } else if (symptoms.includes(currentSymptom.trim())) {
      toast({
        title: "Duplicate symptom",
        description: "This symptom has already been added.",
        variant: "destructive",
      });
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-morphism rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Add your symptoms</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter a symptom (e.g. headache)"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            className="flex-1 bg-black/20 border-white/10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSymptom();
              }
            }}
          />
          <Button
            onClick={addSymptom}
            className="bg-zepmeds-purple hover:bg-zepmeds-purple/80"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {symptoms.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm text-gray-300 mb-2">Your symptoms:</h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="bg-black/30 text-white px-3 py-1 rounded-full flex items-center"
                >
                  <span className="mr-2">{symptom}</span>
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-sm text-gray-300 mb-2">
          Additional information (optional):
        </h3>
        <Textarea
          placeholder="Add any additional details like duration, severity, or context..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="bg-black/20 border-white/10 min-h-[100px]"
        />
      </div>

      <Button
        onClick={onAnalyze}
        className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80 py-6 text-lg"
        disabled={symptoms.length === 0}
      >
        Analyze Symptoms <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default SymptomInput;
