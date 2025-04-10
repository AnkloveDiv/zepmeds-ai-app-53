
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyStatsGraph } from "@/components/activity/WeeklyStatsGraph";
import { HealthMetricsLogger } from "@/components/activity/HealthMetricsLogger";
import { useToast } from "@/components/ui/use-toast";
import { useBackButton } from "@/hooks/useBackButton";

// Define the HealthData interface
interface HealthData {
  id: string;
  date: Date;
  type: string;
  value: number;
  unit: string;
}

const Activity = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("weekly");
  const [healthData, setHealthData] = useState<HealthData[]>([
    {
      id: "1",
      date: new Date("2023-05-01"),
      type: "Blood Pressure",
      value: 120,
      unit: "mmHg"
    },
    {
      id: "2",
      date: new Date("2023-05-02"),
      type: "Heart Rate",
      value: 72,
      unit: "bpm"
    },
    {
      id: "3",
      date: new Date("2023-05-03"),
      type: "Blood Glucose",
      value: 95,
      unit: "mg/dL"
    },
    {
      id: "4",
      date: new Date("2023-05-04"),
      type: "Temperature",
      value: 98.6,
      unit: "°F"
    },
    {
      id: "5",
      date: new Date("2023-05-05"),
      type: "Weight",
      value: 160,
      unit: "lbs"
    }
  ]);
  
  useBackButton();

  const handleAddHealthData = (newData: Omit<HealthData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const data = { ...newData, id };
    setHealthData([...healthData, data]);
    setIsDialogOpen(false);
    toast({
      title: "Health data added",
      description: "Your health data has been logged successfully.",
    });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Activity & Health" />

      <main className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Health Metrics</h2>
            <p className="text-gray-400 text-sm">Track your health journey</p>
          </div>
          <Button
            onClick={handleOpenDialog}
            className="rounded-full bg-zepmeds-purple hover:bg-zepmeds-purple/80"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Log
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Health Metrics</DialogTitle>
            </DialogHeader>
            <HealthMetricsLogger onSubmit={handleAddHealthData} />
          </DialogContent>
        </Dialog>

        <div className="glass-morphism rounded-xl p-4 mb-6">
          <div className="flex items-center text-white mb-3">
            <Calendar className="h-5 w-5 mr-2 text-zepmeds-purple" />
            <span>{format(new Date(), "MMMM d, yyyy")}</span>
          </div>
          
          <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="h-64">
              <WeeklyStatsGraph data={healthData} period="daily" />
            </TabsContent>
            
            <TabsContent value="weekly" className="h-64">
              <WeeklyStatsGraph data={healthData} period="weekly" />
            </TabsContent>
            
            <TabsContent value="monthly" className="h-64">
              <WeeklyStatsGraph data={healthData} period="monthly" />
            </TabsContent>
          </Tabs>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-3">Recent Logs</h3>
        
        <div className="space-y-3">
          {healthData.slice(0, 5).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <h4 className="text-white font-medium">{item.type}</h4>
                <div className="flex items-center">
                  <span className="text-zepmeds-purple text-sm font-semibold">
                    {item.value} {item.unit}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    {format(new Date(item.date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getHealthIndicatorColor(item.type, item.value)}`} />
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

// Helper function to determine the color of the health indicator
const getHealthIndicatorColor = (type: string, value: number): string => {
  switch (type) {
    case "Blood Pressure":
      return value > 140 ? "bg-red-500" : value < 90 ? "bg-yellow-500" : "bg-green-500";
    case "Heart Rate":
      return value > 100 ? "bg-red-500" : value < 60 ? "bg-yellow-500" : "bg-green-500";
    case "Blood Glucose":
      return value > 140 ? "bg-red-500" : value < 70 ? "bg-yellow-500" : "bg-green-500";
    case "Temperature":
      return value > 99.5 ? "bg-red-500" : value < 97.5 ? "bg-yellow-500" : "bg-green-500";
    case "Weight":
      // This is a simplistic example, weight would depend on height, age, etc.
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export default Activity;
