
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
  data: HealthData[];
  period: 'daily' | 'weekly' | 'monthly';
}

export const WeeklyStatsGraph: React.FC<WeeklyStatsGraphProps> = ({ data, period }) => {
  // Process data based on the period
  const processedData = React.useMemo(() => {
    // For demo purposes, we'll just show some dummy data
    // In a real app, you would process the actual data based on the period
    if (period === 'daily') {
      return [
        { name: 'Morning', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Noon', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Evening', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Night', value: Math.floor(Math.random() * 100) + 50 },
      ];
    } else if (period === 'weekly') {
      return [
        { name: 'Mon', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Tue', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Wed', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Thu', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Fri', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Sat', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Sun', value: Math.floor(Math.random() * 100) + 50 },
      ];
    } else {
      return [
        { name: 'Week 1', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Week 2', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Week 3', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Week 4', value: Math.floor(Math.random() * 100) + 50 },
      ];
    }
  }, [period, data]);

  return (
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
  );
};
