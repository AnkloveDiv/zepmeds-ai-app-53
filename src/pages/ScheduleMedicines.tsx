
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import useBackNavigation from "@/hooks/useBackNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ScheduledMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  priority: string;
  deliveryTime: string;
}

const ScheduleMedicines = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [medicineName, setMedicineName] = useState("");
  const [medicineDosage, setMedicineDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  const [scheduledMedicines, setScheduledMedicines] = useState<ScheduledMedicine[]>([
    {
      id: "1",
      name: "Crocin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "08:00",
      priority: "High",
      deliveryTime: "24 hours"
    },
    {
      id: "2",
      name: "Vitamin D3",
      dosage: "60,000 IU",
      frequency: "Once weekly",
      time: "09:00",
      priority: "Medium",
      deliveryTime: "3 days"
    }
  ]);

  const handleAddMedicine = () => {
    if(!medicineName || !medicineDosage || !frequency || !time || !priority || !deliveryTime) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const newMedicine: ScheduledMedicine = {
      id: Date.now().toString(),
      name: medicineName,
      dosage: medicineDosage,
      frequency: frequency,
      time: time,
      priority: priority,
      deliveryTime: deliveryTime
    };
    
    setScheduledMedicines([...scheduledMedicines, newMedicine]);
    
    // Reset form
    setMedicineName("");
    setMedicineDosage("");
    setFrequency("");
    setTime("");
    setPriority("");
    setDeliveryTime("");
    
    toast({
      title: "Medicine Scheduled",
      description: `${medicineName} has been scheduled for delivery in ${deliveryTime}`,
      variant: "default"
    });
  };

  const handleRemoveMedicine = (id: string) => {
    setScheduledMedicines(scheduledMedicines.filter(medicine => medicine.id !== id));
    
    toast({
      title: "Medicine Removed",
      description: "Medicine has been removed from your schedule",
      variant: "default"
    });
  };

  const handleTrackOrder = () => {
    navigate("/order-tracking");
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "text-red-500";
      case "Medium": return "text-amber-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Schedule Medicines" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-5 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Schedule a Medicine</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input 
                id="medicine-name" 
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="Enter medicine name" 
              />
            </div>
            
            <div>
              <Label htmlFor="medicine-dosage">Dosage</Label>
              <Input 
                id="medicine-dosage" 
                value={medicineDosage}
                onChange={(e) => setMedicineDosage(e.target.value)}
                placeholder="e.g. 500mg, 10ml, etc." 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Once weekly">Once weekly</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time">First Dose Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Set priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="delivery-time">Delivery Time</Label>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger id="delivery-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24 hours">24 hours</SelectItem>
                    <SelectItem value="2 days">2 days</SelectItem>
                    <SelectItem value="3 days">3 days</SelectItem>
                    <SelectItem value="5 days">5 days</SelectItem>
                    <SelectItem value="7 days">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleAddMedicine}
              className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine to Schedule
            </Button>
          </div>
        </motion.div>
        
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold text-white">Your Scheduled Medicines</h2>
          
          {scheduledMedicines.length === 0 ? (
            <Card className="bg-background/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">No medicines scheduled</p>
              </CardContent>
            </Card>
          ) : (
            scheduledMedicines.map((medicine) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-morphism rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-white text-lg font-medium">{medicine.name}</h3>
                      <span className={`ml-2 text-sm ${getPriorityColor(medicine.priority)}`}>
                        ({medicine.priority} priority)
                      </span>
                    </div>
                    <p className="text-gray-400">{medicine.dosage} - {medicine.frequency}</p>
                    
                    <div className="mt-2 flex items-center">
                      <Clock className="h-4 w-4 text-zepmeds-purple mr-1" />
                      <span className="text-gray-300 text-sm">{medicine.time}</span>
                      
                      <span className="mx-2 text-gray-600">•</span>
                      
                      <Calendar className="h-4 w-4 text-zepmeds-purple mr-1" />
                      <span className="text-gray-300 text-sm">Delivery in {medicine.deliveryTime}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => handleRemoveMedicine(medicine.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        <div className="glass-morphism rounded-xl p-5">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-zepmeds-purple mr-2" />
            <h3 className="text-lg font-medium text-white">Track Your Medicine Delivery</h3>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Track your scheduled medicine deliveries in real-time to know when you'll receive them.
          </p>
          
          <Button 
            onClick={handleTrackOrder}
            className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80"
          >
            Track Order Status
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ScheduleMedicines;
