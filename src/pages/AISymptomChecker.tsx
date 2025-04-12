
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { analyzeSymptoms, GeminiResponse } from "@/services/geminiService";

// Import refactored components
import SymptomCheckerHeader from "@/components/symptom-checker/Header";
import SymptomInput from "@/components/symptom-checker/SymptomInput";
import AnalysisResult from "@/components/symptom-checker/AnalysisResult";
import LoadingState from "@/components/symptom-checker/LoadingState";
import ErrorDisplay from "@/components/symptom-checker/ErrorDisplay";

const AISymptomChecker: React.FC = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponse | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No symptoms added",
        description: "Please add at least one symptom to analyze.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setShowInput(false);
    setError(null);

    try {
      const result = await analyzeSymptoms(symptoms, additionalInfo);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setError("There was an error analyzing your symptoms. Please try again later.");
      
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setShowInput(true);
    setError(null);
  };

  return (
    <div className="pb-20 min-h-screen bg-background text-white">
      <Header showBackButton title="AI Symptom Checker" />

      <div className="p-4">
        <SymptomCheckerHeader />
        <ErrorDisplay error={error} />

        {showInput ? (
          <SymptomInput 
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            additionalInfo={additionalInfo}
            setAdditionalInfo={setAdditionalInfo}
            onAnalyze={handleAnalyze}
          />
        ) : analyzing ? (
          <LoadingState />
        ) : (
          analysisResult && (
            <AnalysisResult 
              analysisResult={analysisResult} 
              onResetAnalysis={resetAnalysis} 
            />
          )
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AISymptomChecker;
