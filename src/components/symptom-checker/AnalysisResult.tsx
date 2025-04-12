
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeminiResponse } from "@/services/geminiService";

interface AnalysisResultProps {
  analysisResult: GeminiResponse;
  onResetAnalysis: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysisResult,
  onResetAnalysis,
}) => {
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
        onClick={onResetAnalysis}
        className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80"
      >
        Check Different Symptoms
      </Button>
    </motion.div>
  );
};

export default AnalysisResult;
