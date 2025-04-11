
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HealthData {
  id: string;
  date: Date;
  type: string;
  value: number;
  unit: string;
}

interface WeeklyStatsGraphProps {
  data?: HealthData[];
  period?: 'daily' | 'weekly' | 'monthly';
  metric?: string;
}

export const WeeklyStatsGraph: React.FC<WeeklyStatsGraphProps> = ({ data = [], period = 'weekly', metric = 'steps' }) => {
  const [activeMetric, setActiveMetric] = useState<string>(metric);
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>(period);
  
  // Total metrics with animations
  const totalSteps = 53425;
  const totalCalories = 12850;
  const totalWaterIntake = 14.5; // in liters
  
  // Diet data for pie chart
  const dietData = [
    { name: 'Proteins', value: 30, color: '#9b87f5' },
    { name: 'Carbs', value: 45, color: '#33D9B2' },
    { name: 'Fats', value: 15, color: '#FF6B6B' },
    { name: 'Fiber', value: 10, color: '#FFD166' },
  ];

  // Process data based on the period and metric
  const processedData = React.useMemo(() => {
    // For demo purposes, we'll just show some dummy data based on the metric
    // In a real app, you would process the actual data based on the period and metric
    
    const generateRandomValue = () => {
      if (activeMetric === 'steps') {
        return Math.floor(Math.random() * 5000) + 3000; // Random steps between 3000-8000
      } else if (activeMetric === 'heartRate') {
        return Math.floor(Math.random() * 30) + 60; // Random heart rate between 60-90
      } else if (activeMetric === 'blood') {
        return Math.floor(Math.random() * 40) + 80; // Random blood sugar between 80-120
      } else if (activeMetric === 'calories') {
        return Math.floor(Math.random() * 800) + 1200; // Random calories between 1200-2000
      } else if (activeMetric === 'water') {
        return Math.floor(Math.random() * 1000) + 1500; // Random water ml between 1500-2500
      }
      return Math.floor(Math.random() * 100) + 50; // Default random value
    };
    
    if (activePeriod === 'daily') {
      return [
        { name: 'Morning', value: generateRandomValue() },
        { name: 'Noon', value: generateRandomValue() },
        { name: 'Evening', value: generateRandomValue() },
        { name: 'Night', value: generateRandomValue() },
      ];
    } else if (activePeriod === 'weekly') {
      return [
        { name: 'Mon', value: generateRandomValue() },
        { name: 'Tue', value: generateRandomValue() },
        { name: 'Wed', value: generateRandomValue() },
        { name: 'Thu', value: generateRandomValue() },
        { name: 'Fri', value: generateRandomValue() },
        { name: 'Sat', value: generateRandomValue() },
        { name: 'Sun', value: generateRandomValue() },
      ];
    } else {
      return [
        { name: 'Week 1', value: generateRandomValue() },
        { name: 'Week 2', value: generateRandomValue() },
        { name: 'Week 3', value: generateRandomValue() },
        { name: 'Week 4', value: generateRandomValue() },
      ];
    }
  }, [activePeriod, activeMetric]);

  const handleMetricChange = (metric: string) => {
    setActiveMetric(metric);
  };

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setActivePeriod(period);
  };

  const getMetricUnit = () => {
    switch (activeMetric) {
      case 'steps': return 'steps';
      case 'calories': return 'kcal';
      case 'heartRate': return 'bpm';
      case 'blood': return 'mg/dL';
      case 'water': return 'ml';
      default: return '';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Health Statistics</h2>
        
        <div className="flex space-x-2">
          <Button 
            variant={activePeriod === 'daily' ? "default" : "outline"} 
            size="sm" 
            onClick={() => handlePeriodChange('daily')}
            className={activePeriod === 'daily' ? "bg-zepmeds-purple" : ""}
          >
            Day
          </Button>
          <Button 
            variant={activePeriod === 'weekly' ? "default" : "outline"} 
            size="sm" 
            onClick={() => handlePeriodChange('weekly')}
            className={activePeriod === 'weekly' ? "bg-zepmeds-purple" : ""}
          >
            Week
          </Button>
          <Button 
            variant={activePeriod === 'monthly' ? "default" : "outline"} 
            size="sm" 
            onClick={() => handlePeriodChange('monthly')}
            className={activePeriod === 'monthly' ? "bg-zepmeds-purple" : ""}
          >
            Month
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={activeMetric === 'steps' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('steps')}
          className={activeMetric === 'steps' ? "bg-zepmeds-purple" : ""}
        >
          Steps
        </Button>
        <Button 
          variant={activeMetric === 'heartRate' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('heartRate')}
          className={activeMetric === 'heartRate' ? "bg-zepmeds-purple" : ""}
        >
          Heart Rate
        </Button>
        <Button 
          variant={activeMetric === 'blood' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('blood')}
          className={activeMetric === 'blood' ? "bg-zepmeds-purple" : ""}
        >
          Blood Sugar
        </Button>
        <Button 
          variant={activeMetric === 'calories' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('calories')}
          className={activeMetric === 'calories' ? "bg-zepmeds-purple" : ""}
        >
          Calories
        </Button>
        <Button 
          variant={activeMetric === 'water' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('water')}
          className={activeMetric === 'water' ? "bg-zepmeds-purple" : ""}
        >
          Water
        </Button>
        <Button 
          variant={activeMetric === 'diet' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleMetricChange('diet')}
          className={activeMetric === 'diet' ? "bg-zepmeds-purple" : ""}
        >
          Diet
        </Button>
      </div>
      
      {/* Total metrics section */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div 
          className="glass-morphism p-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-sm text-gray-400">Total Steps</h3>
          <p className="text-xl font-bold text-white">{totalSteps.toLocaleString()}</p>
        </motion.div>
        
        <motion.div 
          className="glass-morphism p-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-sm text-gray-400">Total Calories</h3>
          <p className="text-xl font-bold text-white">{totalCalories.toLocaleString()} kcal</p>
        </motion.div>
        
        <motion.div 
          className="glass-morphism p-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-sm text-gray-400">Water Intake</h3>
          <p className="text-xl font-bold text-white">{totalWaterIntake}L</p>
        </motion.div>
      </div>
      
      <motion.div 
        className="h-64 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {activeMetric === 'diet' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dietData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                animationDuration={1500}
                animationBegin={300}
              >
                {dietData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9b87f5' }} axisLine={{ stroke: '#444' }} />
              <YAxis tick={{ fill: '#9b87f5' }} axisLine={{ stroke: '#444' }} />
              <Tooltip
                formatter={(value) => [`${value} ${getMetricUnit()}`, activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)]}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#9b87f5" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyStatsGraph;
