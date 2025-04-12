
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 text-zepmeds-purple animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">
        Analyzing your symptoms...
      </h2>
      <p className="text-gray-400 text-center">
        Our AI is processing your information to provide personalized guidance.
      </p>
    </div>
  );
};

export default LoadingState;
