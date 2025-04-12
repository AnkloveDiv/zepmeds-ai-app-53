
import React, { useState } from "react";
import { Plus, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
        <h2 className="text-lg font-semibold mb-3">Enter your symptoms</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            placeholder="Enter a symptom"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSymptom();
              }
            }}
          />
          <Button
            onClick={addSymptom}
            size="icon"
            className="bg-zepmeds-purple hover:bg-purple-700"
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
                  className="bg-slate-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span className="mr-2 text-sm">{symptom}</span>
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Remove symptom"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm text-gray-300 mb-2">Additional information (optional):</h3>
          <Textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Age, gender, existing conditions, when symptoms started, etc."
            className="bg-slate-800/50 border-slate-700 resize-none h-24"
          />
        </div>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={symptoms.length === 0}
        className="w-full bg-zepmeds-purple hover:bg-purple-700/90 flex items-center justify-center gap-2"
      >
        Analyze Symptoms <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default SymptomInput;
