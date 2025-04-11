
import React, { useState } from "react";
import { PlusCircle, Minus, Edit, Check, Heart, Droplets, Footprints, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const HealthMetricsLogger = () => {
  const { toast } = useToast();
  
  const [steps, setSteps] = useState(7642);
  const [waterIntake, setWaterIntake] = useState(6);
  const [caloriesBurned, setCaloriesBurned] = useState(420);
  
  const [editingSteps, setEditingSteps] = useState(false);
  const [editingWater, setEditingWater] = useState(false);
  const [editingCalories, setEditingCalories] = useState(false);
  
  const [tempSteps, setTempSteps] = useState(steps.toString());
  const [tempWater, setTempWater] = useState(waterIntake.toString());
  const [tempCalories, setTempCalories] = useState(caloriesBurned.toString());

  const handleSaveSteps = () => {
    const newSteps = parseInt(tempSteps);
    if (!isNaN(newSteps) && newSteps >= 0) {
      setSteps(newSteps);
      setEditingSteps(false);
      toast({
        title: "Steps updated",
        description: `Your daily steps count is now ${newSteps}.`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
    }
  };

  const handleSaveWater = () => {
    const newWater = parseInt(tempWater);
    if (!isNaN(newWater) && newWater >= 0) {
      setWaterIntake(newWater);
      setEditingWater(false);
      toast({
        title: "Water intake updated",
        description: `Your daily water intake is now ${newWater} glasses.`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
    }
  };

  const handleSaveCalories = () => {
    const newCalories = parseInt(tempCalories);
    if (!isNaN(newCalories) && newCalories >= 0) {
      setCaloriesBurned(newCalories);
      setEditingCalories(false);
      toast({
        title: "Calories updated",
        description: `Your daily calories burned is now ${newCalories}.`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">Today's Health</h3>
        <span className="text-sm text-gray-400">{new Date().toLocaleDateString()}</span>
      </div>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4">
              <Footprints size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Daily Steps</h4>
              {editingSteps ? (
                <div className="flex items-center mt-1">
                  <Input
                    type="number"
                    value={tempSteps}
                    onChange={(e) => setTempSteps(e.target.value)}
                    className="w-24 h-8 text-sm bg-black/20 border-white/20 text-white"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-500 ml-1"
                    onClick={handleSaveSteps}
                  >
                    <Check size={16} />
                  </Button>
                </div>
              ) : (
                <p className="text-blue-400 text-xl font-bold">{steps.toLocaleString()}</p>
              )}
            </div>
          </div>
          
          {!editingSteps && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => {
                setTempSteps(steps.toString());
                setEditingSteps(true);
              }}
            >
              <Edit size={16} />
            </Button>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mr-4">
              <Droplets size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Water Intake</h4>
              {editingWater ? (
                <div className="flex items-center mt-1">
                  <Input
                    type="number"
                    value={tempWater}
                    onChange={(e) => setTempWater(e.target.value)}
                    className="w-24 h-8 text-sm bg-black/20 border-white/20 text-white"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-500 ml-1"
                    onClick={handleSaveWater}
                  >
                    <Check size={16} />
                  </Button>
                </div>
              ) : (
                <p className="text-cyan-400 text-xl font-bold">{waterIntake} glasses</p>
              )}
            </div>
          </div>
          
          {!editingWater && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => {
                setTempWater(waterIntake.toString());
                setEditingWater(true);
              }}
            >
              <Edit size={16} />
            </Button>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 mr-4">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Calories Burned</h4>
              {editingCalories ? (
                <div className="flex items-center mt-1">
                  <Input
                    type="number"
                    value={tempCalories}
                    onChange={(e) => setTempCalories(e.target.value)}
                    className="w-24 h-8 text-sm bg-black/20 border-white/20 text-white"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-500 ml-1"
                    onClick={handleSaveCalories}
                  >
                    <Check size={16} />
                  </Button>
                </div>
              ) : (
                <p className="text-orange-400 text-xl font-bold">{caloriesBurned} cals</p>
              )}
            </div>
          </div>
          
          {!editingCalories && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => {
                setTempCalories(caloriesBurned.toString());
                setEditingCalories(true);
              }}
            >
              <Edit size={16} />
            </Button>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-morphism rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mr-4">
              <Heart size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">Heart Rate</h4>
              <p className="text-red-400 text-xl font-bold">78 bpm</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <PlusCircle size={16} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthMetricsLogger;
