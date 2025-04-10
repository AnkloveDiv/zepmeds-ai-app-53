
import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";
import WeeklyStatsGraph from "@/components/activity/WeeklyStatsGraph";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Droplet, TrendingUp, Activity as ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const Activity = () => {
  const { toast } = useToast();
  const [bloodPressure, setBloodPressure] = useState({ systolic: "", diastolic: "" });
  const [bloodSugar, setBloodSugar] = useState("");
  const [steps, setSteps] = useState(4280);
  const stepGoal = 10000;
  const stepsProgress = (steps / stepGoal) * 100;
  
  // Color gradient based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 90) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const handleLogVitals = () => {
    // Validate inputs
    if (!bloodPressure.systolic || !bloodPressure.diastolic || !bloodSugar) {
      toast({
        title: "Missing information",
        description: "Please fill in all the fields",
        variant: "destructive"
      });
      return;
    }
    
    // Log the vitals (in a real app, this would save to a database)
    toast({
      title: "Vitals logged",
      description: "Your health metrics have been recorded",
      duration: 3000,
    });
    
    // Reset form
    setBloodPressure({ systolic: "", diastolic: "" });
    setBloodSugar("");
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Activity" />

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Health Tracking</h1>
          <p className="text-gray-400 mb-4">Monitor your health metrics</p>
          
          <div className="glass-morphism rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Today's Activity</h2>
            
            <div className="flex items-center mb-3">
              <ActivityIcon className="text-zepmeds-purple h-5 w-5 mr-2" />
              <span className="text-white">Daily Steps</span>
              <span className="ml-auto text-zepmeds-purple font-bold">{steps.toLocaleString()}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0</span>
                <span>{stepGoal / 2}</span>
                <span>{stepGoal}</span>
              </div>
              <Progress 
                value={stepsProgress} 
                className="h-2.5" 
                indicatorClassName={getProgressColor(stepsProgress)} 
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {Math.round(stepsProgress)}% of daily goal
              </div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Log Today's Vitals</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Heart className="text-red-500 h-5 w-5 mr-2" />
                  <label htmlFor="bloodPressure" className="text-white">Blood Pressure (mmHg)</label>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    id="systolic"
                    type="number"
                    placeholder="Systolic"
                    value={bloodPressure.systolic}
                    onChange={(e) => setBloodPressure({ ...bloodPressure, systolic: e.target.value })}
                    className="bg-black/20 border-gray-700"
                  />
                  <span className="text-white flex items-center">/</span>
                  <Input 
                    id="diastolic"
                    type="number"
                    placeholder="Diastolic"
                    value={bloodPressure.diastolic}
                    onChange={(e) => setBloodPressure({ ...bloodPressure, diastolic: e.target.value })}
                    className="bg-black/20 border-gray-700"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Droplet className="text-blue-500 h-5 w-5 mr-2" />
                  <label htmlFor="bloodSugar" className="text-white">Blood Sugar (mg/dL)</label>
                </div>
                <Input 
                  id="bloodSugar"
                  type="number"
                  placeholder="Fasting blood sugar"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  className="bg-black/20 border-gray-700"
                />
              </div>
              
              <Button 
                onClick={handleLogVitals}
                className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Log Vitals
              </Button>
            </div>
          </div>
          
          <HealthMetricsLogger />
          <WeeklyStatsGraph />
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Activity;
