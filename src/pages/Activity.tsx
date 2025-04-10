import React, { useState } from "react";
import { motion } from "framer-motion";
import { Battery, Calendar, Heart, Droplets, ChevronDown, ChevronUp, X } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyStatsGraph from "@/components/activity/WeeklyStatsGraph";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HealthData {
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
}

const Activity = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([
    { date: "2024-07-15", steps: 5245, heartRate: 72, sleepHours: 7, waterIntake: 3 },
    { date: "2024-07-16", steps: 6870, heartRate: 68, sleepHours: 8, waterIntake: 4 },
    { date: "2024-07-17", steps: 4120, heartRate: 75, sleepHours: 6, waterIntake: 2 },
    { date: "2024-07-18", steps: 7500, heartRate: 70, sleepHours: 7, waterIntake: 3 },
    { date: "2024-07-19", steps: 3200, heartRate: 65, sleepHours: 8, waterIntake: 4 },
    { date: "2024-07-20", steps: 8200, heartRate: 72, sleepHours: 6, waterIntake: 2 },
    { date: "2024-07-21", steps: 9500, heartRate: 68, sleepHours: 7, waterIntake: 3 },
  ]);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [newSteps, setNewSteps] = useState("");
  const [newHeartRate, setNewHeartRate] = useState("");
  const [newSleepHours, setNewSleepHours] = useState("");
  const [newWaterIntake, setNewWaterIntake] = useState("");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const addHealthData = (newData: HealthData) => {
    setHealthData([...healthData, newData]);
  };

  const handleSubmitMetrics = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newEntry: HealthData = {
      date: today,
      steps: parseInt(newSteps, 10) || 0,
      heartRate: parseInt(newHeartRate, 10) || 0,
      sleepHours: parseInt(newSleepHours, 10) || 0,
      waterIntake: parseInt(newWaterIntake, 10) || 0,
    };
    addHealthData(newEntry);
    setIsMetricsModalOpen(false);
    setNewSteps("");
    setNewHeartRate("");
    setNewSleepHours("");
    setNewWaterIntake("");
  };

  const dailyGoals = {
    steps: 8000,
    heartRate: 70,
    sleepHours: 7,
    waterIntake: 3,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Activity" />

      <main className="px-4 py-6">
        <WeeklyStatsGraph healthData={healthData} />

        <Tabs defaultValue="daily" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            {healthData.map((data) => (
              <motion.div
                key={data.date}
                className="glass-morphism rounded-xl p-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">{data.date}</h3>
                  <button onClick={() => toggleExpand(data.date)}>
                    {expandedDate === data.date ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>

                {expandedDate === data.date && (
                  <div className="mt-2">
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Battery className="h-4 w-4 mr-2" /> Steps
                        </span>
                        <span>{data.steps}</span>
                      </div>
                      <Progress value={(data.steps / dailyGoals.steps) * 100} />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" /> Heart Rate
                        </span>
                        <span>{data.heartRate} bpm</span>
                      </div>
                      <Progress value={(data.heartRate / dailyGoals.heartRate) * 100} />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" /> Sleep
                        </span>
                        <span>{data.sleepHours} hours</span>
                      </div>
                      <Progress value={(data.sleepHours / dailyGoals.sleepHours) * 100} />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Droplets className="h-4 w-4 mr-2" /> Water Intake
                        </span>
                        <span>{data.waterIntake} liters</span>
                      </div>
                      <Progress value={(data.waterIntake / dailyGoals.waterIntake) * 100} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </TabsContent>
          <TabsContent value="exercise">
            <div>Exercise Content</div>
          </TabsContent>
          <TabsContent value="sleep">
            <div>Sleep Content</div>
          </TabsContent>
        </Tabs>

        <HealthMetricsLogger onOpen={() => setIsMetricsModalOpen(true)} />
      </main>

      {/* Health Metrics Modal */}
      <Dialog open={isMetricsModalOpen} onOpenChange={setIsMetricsModalOpen}>
        <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Today's Health Metrics</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="steps" className="text-right">
                Steps
              </label>
              <Input
                type="number"
                id="steps"
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="heartRate" className="text-right">
                Heart Rate
              </label>
              <Input
                type="number"
                id="heartRate"
                value={newHeartRate}
                onChange={(e) => setNewHeartRate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="sleepHours" className="text-right">
                Sleep Hours
              </label>
              <Input
                type="number"
                id="sleepHours"
                value={newSleepHours}
                onChange={(e) => setNewSleepHours(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="waterIntake" className="text-right">
                Water Intake (L)</label>
              <Input
                type="number"
                id="waterIntake"
                value={newWaterIntake}
                onChange={(e) => setNewWaterIntake(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={handleSubmitMetrics}>
              Save Metrics
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Activity;
