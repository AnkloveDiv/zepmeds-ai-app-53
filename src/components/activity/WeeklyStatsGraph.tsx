
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type StatType = 'bloodPressure' | 'bloodSugar' | 'steps' | 'activity';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate some random demo data for the graphs
const generateRandomData = (min: number, max: number, type: string) => {
  return daysOfWeek.map(day => ({
    day,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    type
  }));
};

const bloodPressureData = daysOfWeek.map(day => ({
  day,
  systolic: Math.floor(Math.random() * (140 - 110 + 1)) + 110,
  diastolic: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
}));

const bloodSugarData = generateRandomData(80, 140, 'bloodSugar');
const stepsData = generateRandomData(3000, 12000, 'steps');

// Activity data with various colors
const activityData = daysOfWeek.map(day => {
  const minutes = Math.floor(Math.random() * (120 - 20 + 1)) + 20;
  
  // Assign a random activity type to each day
  const activities = [
    { name: 'Walking', color: '#3B82F6' },
    { name: 'Running', color: '#10B981' },
    { name: 'Cycling', color: '#F59E0B' },
    { name: 'Swimming', color: '#8B5CF6' },
    { name: 'Yoga', color: '#EC4899' }
  ];
  
  const activity = activities[Math.floor(Math.random() * activities.length)];
  
  return {
    day,
    minutes,
    name: activity.name,
    color: activity.color
  };
});

const WeeklyStatsGraph = () => {
  const [activeTab, setActiveTab] = useState<StatType>('bloodPressure');
  
  const renderCustomBarShape = (props: any) => {
    const { fill, x, y, width, height } = props;
    
    const radius = 4;
    
    if (activeTab === 'activity') {
      return (
        <g>
          <defs>
            <linearGradient id={`gradientBar-${x}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity={1} />
              <stop offset="100%" stopColor={fill} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={radius}
            ry={radius}
            fill={`url(#gradientBar-${x})`}
          />
        </g>
      );
    }
    
    return (
      <g>
        <defs>
          <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9b87f5" stopOpacity={1} />
            <stop offset="100%" stopColor="#7E69AB" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="url(#gradientBar)"
        />
      </g>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (activeTab === 'bloodPressure') {
        return (
          <div className="p-2 bg-black/80 shadow-lg rounded text-white text-xs">
            <p>{`${label}: ${payload[0].value}/${payload[1].value}`}</p>
          </div>
        );
      }
      
      return (
        <div className="p-2 bg-black/80 shadow-lg rounded text-white text-xs">
          <p>{`${label}: ${payload[0].value}`}</p>
          {activeTab === 'bloodSugar' && <p>mg/dL</p>}
          {activeTab === 'steps' && <p>steps</p>}
          {activeTab === 'activity' && <p>{`${payload[0].payload.name}`}</p>}
        </div>
      );
    }
  
    return null;
  };
  
  return (
    <div className="glass-morphism rounded-xl p-4 mt-6">
      <h2 className="text-lg font-semibold text-white mb-4">Weekly Statistics</h2>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-black/30 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bloodPressure' ? 'bg-zepmeds-purple text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('bloodPressure')}
        >
          <Heart className="h-4 w-4 mx-auto mb-1" />
          BP
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bloodSugar' ? 'bg-zepmeds-purple text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('bloodSugar')}
        >
          <TrendingUp className="h-4 w-4 mx-auto mb-1" />
          Sugar
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'steps' ? 'bg-zepmeds-purple text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('steps')}
        >
          <Activity className="h-4 w-4 mx-auto mb-1" />
          Steps
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'activity' ? 'bg-zepmeds-purple text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity className="h-4 w-4 mx-auto mb-1" />
          Activity
        </button>
      </div>
      
      {/* Chart Area */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'bloodPressure' ? (
            <BarChart
              data={bloodPressureData}
              margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
              barGap={0}
              barCategoryGap="25%"
            >
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="systolic" 
                fill="#9b87f5" 
                radius={[4, 4, 0, 0]} 
                shape={renderCustomBarShape}
              />
              <Bar 
                dataKey="diastolic" 
                fill="#7E69AB" 
                radius={[4, 4, 0, 0]} 
                shape={renderCustomBarShape}
              />
            </BarChart>
          ) : activeTab === 'activity' ? (
            <BarChart
              data={activityData}
              margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
            >
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="minutes" 
                radius={[4, 4, 0, 0]} 
                shape={renderCustomBarShape}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={activeTab === 'bloodSugar' ? bloodSugarData : stepsData}
              margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
            >
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#9b87f5" 
                radius={[4, 4, 0, 0]} 
                shape={renderCustomBarShape}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 grid grid-cols-3 gap-2"
      >
        {activeTab === 'bloodPressure' && (
          <>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Average</p>
              <p className="text-white font-medium">120/80</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Highest</p>
              <p className="text-white font-medium">130/85</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Lowest</p>
              <p className="text-white font-medium">115/75</p>
            </div>
          </>
        )}
        
        {activeTab === 'bloodSugar' && (
          <>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Average</p>
              <p className="text-white font-medium">110 mg/dL</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Highest</p>
              <p className="text-white font-medium">125 mg/dL</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Lowest</p>
              <p className="text-white font-medium">95 mg/dL</p>
            </div>
          </>
        )}
        
        {activeTab === 'steps' && (
          <>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Daily Avg</p>
              <p className="text-white font-medium">8,240</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Weekly</p>
              <p className="text-white font-medium">57,680</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Goal</p>
              <p className="text-white font-medium">70,000</p>
            </div>
          </>
        )}
        
        {activeTab === 'activity' && (
          <>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Total Time</p>
              <p className="text-white font-medium">540 min</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Workouts</p>
              <p className="text-white font-medium">12</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-gray-400">Goal</p>
              <p className="text-white font-medium">600 min</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyStatsGraph;
