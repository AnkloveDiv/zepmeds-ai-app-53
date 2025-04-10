
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Heart, TrendingUp, Award } from "lucide-react";

// Fixed imports
import { WeeklyStatsGraph } from "@/components/activity/WeeklyStatsGraph";
import HealthMetricsLogger from "@/components/activity/HealthMetricsLogger";

const Activity = () => {
  const navigate = useNavigate();
  const [activeMetric, setActiveMetric] = useState("steps");
  
  useBackNavigation();

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header showBackButton title="Activity" />
      
      <main className="p-4">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-6">
            <div className="rounded-lg glass-morphism p-5">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-zepmeds-purple" />
                Daily Health Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 text-sm">Steps</div>
                  <div className="text-white text-xl font-semibold">8,423</div>
                  <div className="text-green-400 text-xs mt-1">+12% from yesterday</div>
                </div>
                
                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 text-sm">Heart Rate</div>
                  <div className="text-white text-xl font-semibold">72 BPM</div>
                  <div className="text-gray-400 text-xs mt-1">Average</div>
                </div>
                
                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 text-sm">Blood Sugar</div>
                  <div className="text-white text-xl font-semibold">98 mg/dL</div>
                  <div className="text-green-400 text-xs mt-1">Normal</div>
                </div>
                
                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-gray-400 text-sm">Blood Pressure</div>
                  <div className="text-white text-xl font-semibold">120/80</div>
                  <div className="text-green-400 text-xs mt-1">Normal</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg glass-morphism p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-zepmeds-purple" />
                  Weekly Trends
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigate("/reports")}>
                  All Reports
                </Button>
              </div>
              
              <WeeklyStatsGraph metric={activeMetric} />
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant={activeMetric === "steps" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveMetric("steps")}
                >
                  Steps
                </Button>
                <Button 
                  variant={activeMetric === "heartRate" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveMetric("heartRate")}
                >
                  Heart Rate
                </Button>
                <Button 
                  variant={activeMetric === "blood" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveMetric("blood")}
                >
                  Blood Tests
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="text-center text-gray-400 py-8">
              <AlertCircle className="mx-auto h-12 w-12 mb-2 text-zepmeds-purple opacity-70" />
              <p>Weekly statistics visualization coming soon!</p>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <div className="text-center text-gray-400 py-8">
              <AlertCircle className="mx-auto h-12 w-12 mb-2 text-zepmeds-purple opacity-70" />
              <p>Monthly statistics visualization coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6 bg-white/10" />
        
        <div className="rounded-lg glass-morphism p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="mr-2 h-5 w-5 text-zepmeds-purple" />
            Log Your Health Metrics
          </h3>
          
          <HealthMetricsLogger />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Activity;
