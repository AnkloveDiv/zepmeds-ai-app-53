
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Thermometer, TrendingUp, Plus, Weight, Droplets } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const HealthMetricsLogger = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    bloodSugar: "",
    weight: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Heart className="h-4 w-4 text-red-500 mr-2" />
            <Label htmlFor="heartRate" className="text-white">Heart Rate</Label>
          </div>
          <div className="flex items-center">
            <Input
              id="heartRate"
              name="heartRate"
              type="number"
              placeholder="e.g., 72"
              className="bg-black/20 border-white/10 flex-1"
              value={metrics.heartRate}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-400 text-sm">BPM</span>
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Activity className="h-4 w-4 text-blue-500 mr-2" />
            <Label htmlFor="bloodPressure" className="text-white">Blood Pressure</Label>
          </div>
          <div className="flex items-center">
            <Input
              id="bloodPressure"
              name="bloodPressure"
              placeholder="e.g., 120/80"
              className="bg-black/20 border-white/10 flex-1"
              value={metrics.bloodPressure}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-400 text-sm">mmHg</span>
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-yellow-500 mr-2" />
            <Label htmlFor="temperature" className="text-white">Temperature</Label>
          </div>
          <div className="flex items-center">
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g., 98.6"
              className="bg-black/20 border-white/10 flex-1"
              value={metrics.temperature}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-400 text-sm">°F</span>
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
            <Label htmlFor="bloodSugar" className="text-white">Blood Sugar</Label>
          </div>
          <div className="flex items-center">
            <Input
              id="bloodSugar"
              name="bloodSugar"
              type="number"
              placeholder="e.g., 120"
              className="bg-black/20 border-white/10 flex-1"
              value={metrics.bloodSugar}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-400 text-sm">mg/dL</span>
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Weight className="h-4 w-4 text-green-500 mr-2" />
            <Label htmlFor="weight" className="text-white">Weight</Label>
          </div>
          <div className="flex items-center">
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              placeholder="e.g., 70"
              className="bg-black/20 border-white/10 flex-1"
              value={metrics.weight}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-400 text-sm">kg</span>
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
