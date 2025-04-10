
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  // Process data based on the period and metric
  const processedData = React.useMemo(() => {
    // For demo purposes, we'll just show some dummy data based on the metric
    // In a real app, you would process the actual data based on the period and metric
    
    const generateRandomValue = () => {
      if (metric === 'steps') {
        return Math.floor(Math.random() * 5000) + 3000; // Random steps between 3000-8000
      } else if (metric === 'heartRate') {
        return Math.floor(Math.random() * 30) + 60; // Random heart rate between 60-90
      } else if (metric === 'blood') {
        return Math.floor(Math.random() * 40) + 80; // Random blood sugar between 80-120
      }
      return Math.floor(Math.random() * 100) + 50; // Default random value
    };
    
    if (period === 'daily') {
      return [
        { name: 'Morning', value: generateRandomValue() },
        { name: 'Noon', value: generateRandomValue() },
        { name: 'Evening', value: generateRandomValue() },
        { name: 'Night', value: generateRandomValue() },
      ];
    } else if (period === 'weekly') {
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
  }, [period, metric]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#9b87f5' }} axisLine={{ stroke: '#444' }} />
          <YAxis tick={{ fill: '#9b87f5' }} axisLine={{ stroke: '#444' }} />
          <Tooltip
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
    </div>
  );
};
