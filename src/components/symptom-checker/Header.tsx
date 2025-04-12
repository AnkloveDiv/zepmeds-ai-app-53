
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

const SymptomCheckerHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-zepmeds-purple flex items-center justify-center">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          AI Symptom Checker
        </h1>
        <p className="text-gray-300 text-sm">
          Enter your symptoms to receive an AI-powered assessment.
          <br />
          <span className="text-red-400 text-xs">
            Not a substitute for professional medical advice.
          </span>
        </p>
      </motion.div>
    </>
  );
};

export default SymptomCheckerHeader;
