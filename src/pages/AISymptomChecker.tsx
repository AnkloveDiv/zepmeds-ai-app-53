
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { analyzeSymptoms, GeminiResponse } from "@/services/geminiService";

// Import components from the barrel file
import {
  SymptomCheckerHeader,
  SymptomInput,
  AnalysisResult,
  LoadingState,
  ErrorDisplay
} from "@/components/symptom-checker";

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
      console.log("Starting symptom analysis with:", symptoms);
      const result = await analyzeSymptoms(symptoms, additionalInfo);
      console.log("Analysis result:", result);
      
      if (result) {
        setAnalysisResult(result);
        toast({
          title: "Analysis complete",
          description: "Your symptoms have been analyzed.",
        });
      } else {
        throw new Error("No analysis result returned");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      setError("There was an error analyzing your symptoms. Please try again later.");
      
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your symptoms. Please try again.",
        variant: "destructive",
      });
      
      // Show input form again on error
      setShowInput(true);
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
