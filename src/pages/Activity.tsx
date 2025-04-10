
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeeklyStatsGraph } from "@/components/activity/WeeklyStatsGraph";
import { HealthMetricsLogger } from "@/components/activity/HealthMetricsLogger";
import { motion } from "framer-motion";
import { Activity as ActivityIcon, Dumbbell, Heart, Moon, PlusCircle, Target } from "lucide-react";

const Activity = () => {
  const [selectedView, setSelectedView] = useState<"daily" | "weekly">("daily");
  const [selectedActivity, setSelectedActivity] = useState<string>("steps");
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [steps, setSteps] = useState<number>(5348);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(320);
  const [waterIntake, setWaterIntake] = useState<number>(4);
  
  const [todaysBp, setTodaysBp] = useState({ systolic: 120, diastolic: 80 });
  const [todaysBloodSugar, setTodaysBloodSugar] = useState(95);
  
  const [targetSteps] = useState<number>(10000);
  const [targetCalories] = useState<number>(500);
  const [targetWater] = useState<number>(8);
  const [targetSleep] = useState<number>(8);
  
  const [progressColor, setProgressColor] = useState<string>("bg-red-500");
  
  const getStepsProgressColor = (steps: number) => {
    const percentage = (steps / targetSteps) * 100;
    if (percentage < 30) return "bg-red-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 80) return "bg-blue-500";
    return "bg-green-500";
  };
  
  useEffect(() => {
    setProgressColor(getStepsProgressColor(steps));
    
    // Simulate step count increasing throughout the day
    const interval = setInterval(() => {
      setSteps(prev => {
        const newSteps = prev + Math.floor(Math.random() * 50);
        return newSteps > targetSteps ? targetSteps : newSteps;
      });
      
      setHeartRate(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(60, Math.min(100, prev + change));
      });
      
      setCaloriesBurned(prev => Math.min(targetCalories, prev + Math.floor(Math.random() * 5)));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [steps, targetSteps, targetCalories]);
  
  const handleLogBP = (systolic: number, diastolic: number) => {
    setTodaysBp({ systolic, diastolic });
  };
  
  const handleLogBloodSugar = (value: number) => {
    setTodaysBloodSugar(value);
  };
  
  const healthMetrics = [
    { name: "Steps", icon: <ActivityIcon className="h-5 w-5" />, value: steps, target: targetSteps, unit: "steps", percentage: (steps / targetSteps) * 100 },
    { name: "Calories", icon: <Dumbbell className="h-5 w-5" />, value: caloriesBurned, target: targetCalories, unit: "kcal", percentage: (caloriesBurned / targetCalories) * 100 },
    { name: "Water", icon: <PlusCircle className="h-5 w-5" />, value: waterIntake, target: targetWater, unit: "glasses", percentage: (waterIntake / targetWater) * 100 },
    { name: "Sleep", icon: <Moon className="h-5 w-5" />, value: sleepHours, target: targetSleep, unit: "hours", percentage: (sleepHours / targetSleep) * 100 },
    { name: "Heart Rate", icon: <Heart className="h-5 w-5" />, value: heartRate, target: null, unit: "bpm", percentage: null },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Activity & Health" />
      
      <main className="px-4 py-4">
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="health">Health Tracking</TabsTrigger>
            <TabsTrigger value="activity">My Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health" className="space-y-4">
            <Card className="glass-morphism shadow-none border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-zepmeds-purple" />
                  Today's Progress
                </CardTitle>
                <CardDescription>
                  Your daily health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {healthMetrics.map((metric) => (
                    metric.percentage !== null && (
                      <div key={metric.name} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-2">
                              {metric.icon}
                            </div>
                            <span className="text-sm font-medium text-white">{metric.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{metric.value.toLocaleString()} {metric.unit}</span>
                            <span className="text-xs text-gray-400 ml-1">/ {metric.target?.toLocaleString()} {metric.unit}</span>
                          </div>
                        </div>
                        <Progress 
                          value={metric.percentage} 
                          className="h-2 bg-gray-700"
                        />
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zepmeds-purple/20 flex items-center justify-center mr-2">
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <span className="text-sm font-bold text-red-500">{heartRate} BPM</span>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="glass-morphism shadow-none border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Log Today's Health Data</CardTitle>
                <CardDescription>
                  Update your vital measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthMetricsLogger 
                  onLogBP={handleLogBP} 
                  onLogBloodSugar={handleLogBloodSugar}
                  currentBP={todaysBp}
                  currentBloodSugar={todaysBloodSugar}
                />
              </CardContent>
            </Card>
            
            <Card className="glass-morphism shadow-none border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weekly Stats</CardTitle>
                <CardDescription>
                  Your health overview for the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <WeeklyStatsGraph />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg ${selectedView === "daily" ? "bg-zepmeds-purple" : "bg-black/20 border border-white/10"}`}
                onClick={() => setSelectedView("daily")}
              >
                Daily
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg ${selectedView === "weekly" ? "bg-zepmeds-purple" : "bg-black/20 border border-white/10"}`}
                onClick={() => setSelectedView("weekly")}
              >
                Weekly
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-black/20 border border-white/10"
              >
                Monthly
              </motion.button>
            </div>
            
            <Card className="glass-morphism shadow-none border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activity Summary</CardTitle>
                <CardDescription>
                  {selectedView === "daily" ? "Today's activities" : "This week's activities"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Content for the Activity tab will go here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Activity;
