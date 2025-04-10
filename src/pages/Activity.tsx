
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity as ActivityIcon, Heart, Utensils, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Activity = () => {
  const [activeTab, setActiveTab] = useState("health");

  // Mock data for health metrics
  const bloodPressureData = [
    { day: "Mon", systolic: 120, diastolic: 80 },
    { day: "Tue", systolic: 122, diastolic: 82 },
    { day: "Wed", systolic: 119, diastolic: 79 },
    { day: "Thu", systolic: 121, diastolic: 81 },
    { day: "Fri", systolic: 118, diastolic: 78 },
    { day: "Sat", systolic: 120, diastolic: 80 },
    { day: "Sun", systolic: 117, diastolic: 77 }
  ];

  const bloodSugarData = [
    { day: "Mon", fasting: 92, postMeal: 120 },
    { day: "Tue", fasting: 94, postMeal: 125 },
    { day: "Wed", fasting: 90, postMeal: 118 },
    { day: "Thu", fasting: 93, postMeal: 122 },
    { day: "Fri", fasting: 91, postMeal: 119 },
    { day: "Sat", fasting: 89, postMeal: 116 },
    { day: "Sun", fasting: 92, postMeal: 121 }
  ];

  const caloriesData = [
    { day: "Mon", intake: 2100, burnt: 1800 },
    { day: "Tue", intake: 2200, burnt: 1900 },
    { day: "Wed", intake: 2000, burnt: 2100 },
    { day: "Thu", intake: 2150, burnt: 1950 },
    { day: "Fri", intake: 2300, burnt: 2000 },
    { day: "Sat", intake: 2250, burnt: 1700 },
    { day: "Sun", intake: 2050, burnt: 1600 }
  ];

  const healthMetrics = [
    { icon: <Heart className="h-5 w-5 text-red-500" />, name: "Resting Heart Rate", value: "72 bpm", status: "normal" },
    { icon: <TrendingUp className="h-5 w-5 text-blue-500" />, name: "Blood Pressure", value: "120/80 mmHg", status: "normal" },
    { icon: <ActivityIcon className="h-5 w-5 text-green-500" />, name: "Step Count", value: "8,542", status: "good" },
    { icon: <Utensils className="h-5 w-5 text-amber-500" />, name: "Calories", value: "1,842 / 2,100", status: "good" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Health Activity" />
      
      <main className="px-4 py-4">
        <Tabs defaultValue="health" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="activity">Exercise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {healthMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-morphism rounded-xl p-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center mr-2">
                        {metric.icon}
                      </div>
                      <span className="text-gray-400 text-sm">{metric.name}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xl font-bold text-white">{metric.value}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        metric.status === 'normal' ? 'bg-blue-500/20 text-blue-500' :
                        metric.status === 'good' ? 'bg-green-500/20 text-green-500' : 
                        'bg-amber-500/20 text-amber-500'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-morphism rounded-xl p-4"
              >
                <h3 className="text-white font-medium mb-4">Blood Pressure</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#9b87f5' }}
                      />
                      <Line type="monotone" dataKey="systolic" stroke="#9b87f5" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-morphism rounded-xl p-4"
              >
                <h3 className="text-white font-medium mb-4">Blood Sugar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodSugarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#9b87f5' }}
                      />
                      <Line type="monotone" dataKey="fasting" stroke="#ff7300" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="postMeal" stroke="#387dff" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="diet">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="glass-morphism rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Calorie Intake vs Burnt</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={caloriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#9b87f5' }}
                      />
                      <Line type="monotone" dataKey="intake" stroke="#ff7300" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="burnt" stroke="#387dff" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Nutrition Breakdown</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-zepmeds-purple mb-1">65g</div>
                    <div className="text-xs text-gray-400">Protein</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">200g</div>
                    <div className="text-xs text-gray-400">Carbs</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-500 mb-1">45g</div>
                    <div className="text-xs text-gray-400">Fats</div>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Water Intake</h3>
                <div className="flex items-center">
                  <div className="relative w-full h-8 bg-black/20 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-blue-500/50 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="ml-3 text-white font-medium">1.5/2L</div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="glass-morphism rounded-xl p-4">
                <h3 className="text-white font-medium mb-2">Daily Activity</h3>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl font-bold text-zepmeds-purple">8,542</div>
                  <div className="text-lg text-gray-400">steps today</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Goal</span>
                      <span className="text-white">10,000 steps</span>
                    </div>
                    <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-zepmeds-purple rounded-full" style={{ width: '85.4%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white mb-1">4.2km</div>
                      <div className="text-xs text-gray-400">Distance</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white mb-1">320</div>
                      <div className="text-xs text-gray-400">Calories</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white mb-1">42min</div>
                      <div className="text-xs text-gray-400">Active Time</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Weekly Stats</h3>
                <div className="flex justify-between mb-2">
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '60%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">M</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '75%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">T</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '45%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">W</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple rounded-t-sm" style={{ height: '85%' }}></div>
                    </div>
                    <div className="text-xs text-white">T</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '70%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">F</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '30%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">S</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-6 mb-1">
                      <div className="absolute bottom-0 w-6 bg-zepmeds-purple/50 rounded-t-sm" style={{ height: '20%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400">S</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Activity;
