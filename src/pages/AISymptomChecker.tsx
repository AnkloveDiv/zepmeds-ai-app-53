
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Plus, Minus, AlertTriangle, Check, ArrowRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { analyzeSymptoms, GeminiResponse } from "@/services/geminiService";

const AISymptomChecker = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponse | null>(null);
  const [showInput, setShowInput] = useState(true);

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

    try {
      const result = await analyzeSymptoms(symptoms, additionalInfo);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
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
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-background text-white">
      <Header showBackButton title="AI Symptom Checker" />

      <div className="p-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-zepmeds-purple flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            AI Symptom Checker
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your symptoms for AI-powered analysis and medicine recommendations.
            <br />
            <span className="text-red-400 text-xs">
              Not a substitute for professional medical advice.
            </span>
          </p>
        </motion.div>

        {showInput ? (
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
              onClick={handleAnalyze}
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80 py-6 text-lg"
              disabled={symptoms.length === 0}
            >
              Analyze Symptoms <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        ) : analyzing ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 text-zepmeds-purple animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Analyzing your symptoms...
            </h2>
            <p className="text-gray-400 text-center">
              Our AI is processing your information to provide personalized guidance.
            </p>
          </div>
        ) : (
          analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Severity Indicator */}
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Severity Assessment</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                    {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                  </div>
                </div>
                
                {analysisResult.seekMedicalAttention && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-white text-sm">
                      Based on your symptoms, it is recommended that you seek immediate medical attention.
                    </p>
                  </div>
                )}
              </div>

              {/* Analysis */}
              <div className="glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Analysis</h2>
                <p className="text-gray-300 text-sm">{analysisResult.analysis}</p>
              </div>

              {/* Recommended Medicines */}
              <div className="glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Recommended Medicines</h2>
                <ul className="space-y-2">
                  {analysisResult.recommendedMedicines.map((medicine, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{medicine}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exercise Recommendations */}
              <div className="glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Exercise Recommendations</h2>
                <ul className="space-y-2">
                  {analysisResult.exerciseRecommendations.map((exercise, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ways to Cure */}
              <div className="glass-morphism rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Ways to Manage Symptoms</h2>
                <ul className="space-y-2">
                  {analysisResult.cureOptions.map((cure, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{cure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-amber-200 text-xs text-center">
                  This analysis is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always seek the advice of your physician or other qualified health provider with any questions 
                  you may have regarding a medical condition.
                </p>
              </div>

              <Button
                onClick={resetAnalysis}
                className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80"
              >
                Check Different Symptoms
              </Button>
            </motion.div>
          )
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AISymptomChecker;
