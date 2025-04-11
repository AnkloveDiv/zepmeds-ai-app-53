
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Thermometer, TrendingUp, Plus, Weight, Droplets } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MetricErrors {
  heartRate?: string;
  bloodPressure?: string;
  temperature?: string;
  bloodSugar?: string;
  weight?: string;
}

const HealthMetricsLogger = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    bloodSugar: "",
    weight: "",
  });

  const [errors, setErrors] = useState<MetricErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user starts typing again
    if (errors[name as keyof MetricErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateMetrics = (): boolean => {
    const newErrors: MetricErrors = {};
    let isValid = true;

    // Heart rate validation (40-220 bpm)
    if (!metrics.heartRate) {
      newErrors.heartRate = "Heart rate is required";
      isValid = false;
    } else if (isNaN(Number(metrics.heartRate)) || Number(metrics.heartRate) < 40 || Number(metrics.heartRate) > 220) {
      newErrors.heartRate = "Heart rate must be between 40-220 bpm";
      isValid = false;
    }

    // Blood pressure validation (format: systolic/diastolic)
    if (!metrics.bloodPressure) {
      newErrors.bloodPressure = "Blood pressure is required";
      isValid = false;
    } else {
      const bpPattern = /^\d{2,3}\/\d{2,3}$/;
      if (!bpPattern.test(metrics.bloodPressure)) {
        newErrors.bloodPressure = "Format should be systolic/diastolic (e.g., 120/80)";
        isValid = false;
      } else {
        const [systolic, diastolic] = metrics.bloodPressure.split('/').map(Number);
        if (systolic < 70 || systolic > 220) {
          newErrors.bloodPressure = "Systolic should be between 70-220";
          isValid = false;
        }
        if (diastolic < 40 || diastolic > 130) {
          newErrors.bloodPressure = "Diastolic should be between 40-130";
          isValid = false;
        }
      }
    }

    // Temperature validation (95-108°F)
    if (!metrics.temperature) {
      newErrors.temperature = "Temperature is required";
      isValid = false;
    } else if (isNaN(Number(metrics.temperature)) || Number(metrics.temperature) < 95 || Number(metrics.temperature) > 108) {
      newErrors.temperature = "Temperature must be between 95-108°F";
      isValid = false;
    }

    // Blood sugar validation (40-500 mg/dL)
    if (!metrics.bloodSugar) {
      newErrors.bloodSugar = "Blood sugar is required";
      isValid = false;
    } else if (isNaN(Number(metrics.bloodSugar)) || Number(metrics.bloodSugar) < 40 || Number(metrics.bloodSugar) > 500) {
      newErrors.bloodSugar = "Blood sugar must be between 40-500 mg/dL";
      isValid = false;
    }

    // Weight validation (20-500 kg)
    if (!metrics.weight) {
      newErrors.weight = "Weight is required";
      isValid = false;
    } else if (isNaN(Number(metrics.weight)) || Number(metrics.weight) < 20 || Number(metrics.weight) > 500) {
      newErrors.weight = "Weight must be between 20-500 kg";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateMetrics()) {
      // In a real app, this would be sent to a backend API
      toast({
        title: "Health metrics logged!",
        description: "Your health data has been saved successfully.",
      });
      
      // Clear form after submission
      setMetrics({
        heartRate: "",
        bloodPressure: "",
        temperature: "",
        bloodSugar: "",
        weight: "",
      });
      
      setErrors({});
    } else {
      toast({
        title: "Validation errors",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Heart className="h-4 w-4 text-red-500 mr-2" />
            <Label htmlFor="heartRate" className="text-white">Heart Rate</Label>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                placeholder="e.g., 72"
                className={`bg-black/20 border-white/10 flex-1 ${errors.heartRate ? 'border-red-500' : ''}`}
                value={metrics.heartRate}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-400 text-sm">BPM</span>
            </div>
            {errors.heartRate && (
              <span className="text-red-500 text-xs mt-1">{errors.heartRate}</span>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Activity className="h-4 w-4 text-blue-500 mr-2" />
            <Label htmlFor="bloodPressure" className="text-white">Blood Pressure</Label>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Input
                id="bloodPressure"
                name="bloodPressure"
                placeholder="e.g., 120/80"
                className={`bg-black/20 border-white/10 flex-1 ${errors.bloodPressure ? 'border-red-500' : ''}`}
                value={metrics.bloodPressure}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-400 text-sm">mmHg</span>
            </div>
            {errors.bloodPressure && (
              <span className="text-red-500 text-xs mt-1">{errors.bloodPressure}</span>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-yellow-500 mr-2" />
            <Label htmlFor="temperature" className="text-white">Temperature</Label>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="e.g., 98.6"
                className={`bg-black/20 border-white/10 flex-1 ${errors.temperature ? 'border-red-500' : ''}`}
                value={metrics.temperature}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-400 text-sm">°F</span>
            </div>
            {errors.temperature && (
              <span className="text-red-500 text-xs mt-1">{errors.temperature}</span>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
            <Label htmlFor="bloodSugar" className="text-white">Blood Sugar</Label>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Input
                id="bloodSugar"
                name="bloodSugar"
                type="number"
                placeholder="e.g., 120"
                className={`bg-black/20 border-white/10 flex-1 ${errors.bloodSugar ? 'border-red-500' : ''}`}
                value={metrics.bloodSugar}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-400 text-sm">mg/dL</span>
            </div>
            {errors.bloodSugar && (
              <span className="text-red-500 text-xs mt-1">{errors.bloodSugar}</span>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Weight className="h-4 w-4 text-green-500 mr-2" />
            <Label htmlFor="weight" className="text-white">Weight</Label>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                className={`bg-black/20 border-white/10 flex-1 ${errors.weight ? 'border-red-500' : ''}`}
                value={metrics.weight}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-400 text-sm">kg</span>
            </div>
            {errors.weight && (
              <span className="text-red-500 text-xs mt-1">{errors.weight}</span>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/90">
        <Plus className="mr-2 h-4 w-4" />
        Log Health Metrics
      </Button>
    </form>
  );
};

export default HealthMetricsLogger;
