
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

type MetricType = 'bloodPressure' | 'bloodSugar' | 'steps';

interface MetricEntry {
  id: string;
  time: string;
  value: string | number;
  type: MetricType;
}

const HealthMetricsLogger = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<MetricType>('bloodPressure');
  const [showForm, setShowForm] = useState(false);
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [steps, setSteps] = useState('');
  const [dailyStepGoal] = useState(10000);
  
  // State for storing logged metrics
  const [metrics, setMetrics] = useState<MetricEntry[]>([
    { id: '1', time: '08:30 AM', value: '120/80', type: 'bloodPressure' },
    { id: '2', time: '01:15 PM', value: '118/78', type: 'bloodPressure' },
    { id: '3', time: '08:45 AM', value: 110, type: 'bloodSugar' },
    { id: '4', time: '01:30 PM', value: 120, type: 'bloodSugar' },
    { id: '5', time: '10:00 AM', value: 3500, type: 'steps' },
    { id: '6', time: '03:00 PM', value: 7200, type: 'steps' },
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = Date.now().toString();
    
    let newMetric: MetricEntry | null = null;
    
    if (activeTab === 'bloodPressure' && bpSystolic && bpDiastolic) {
      newMetric = {
        id: newId,
        time: timeString,
        value: `${bpSystolic}/${bpDiastolic}`,
        type: 'bloodPressure'
      };
      setBpSystolic('');
      setBpDiastolic('');
    } else if (activeTab === 'bloodSugar' && bloodSugar) {
      newMetric = {
        id: newId,
        time: timeString,
        value: parseInt(bloodSugar),
        type: 'bloodSugar'
      };
      setBloodSugar('');
    } else if (activeTab === 'steps' && steps) {
      newMetric = {
        id: newId,
        time: timeString,
        value: parseInt(steps),
        type: 'steps'
      };
      setSteps('');
    }
    
    if (newMetric) {
      setMetrics([...metrics, newMetric]);
      setShowForm(false);
      
      toast({
        title: 'Metric logged',
        description: `Your ${getMetricTitle(activeTab).toLowerCase()} has been recorded successfully.`,
        duration: 3000,
      });
    }
  };
  
  const getMetricTitle = (type: MetricType): string => {
    switch (type) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'bloodSugar': return 'Blood Sugar';
      case 'steps': return 'Steps';
    }
  };
  
  const getTodayTotal = (type: MetricType): number => {
    if (type === 'steps') {
      return metrics
        .filter(m => m.type === type)
        .reduce((sum, entry) => sum + (typeof entry.value === 'number' ? entry.value : 0), 0);
    }
    return 0;
  };
  
  const todaySteps = getTodayTotal('steps');
  const stepProgress = Math.min(100, (todaySteps / dailyStepGoal) * 100);
  
  return (
    <div className="glass-morphism rounded-xl p-4 mt-6">
      <h2 className="text-lg font-semibold text-white mb-4">Today's Health Metrics</h2>
      
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
          <BarChart3 className="h-4 w-4 mx-auto mb-1" />
          Steps
        </button>
      </div>
      
      {/* Steps Progress */}
      {activeTab === 'steps' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Daily Goal</span>
            <span className="text-sm font-medium text-white">{todaySteps} / {dailyStepGoal}</span>
          </div>
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${stepProgress}%`,
                background: `linear-gradient(90deg, 
                  ${stepProgress < 30 ? '#f87171' : stepProgress < 70 ? '#fb923c' : '#22c55e'} 0%,
                  ${stepProgress < 30 ? '#ef4444' : stepProgress < 70 ? '#f97316' : '#16a34a'} 100%)`
              }}
            />
          </div>
        </div>
      )}
      
      {/* Today's Entries */}
      <div className="space-y-3">
        {metrics
          .filter(metric => metric.type === activeTab)
          .map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 border border-white/5 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <span className="text-gray-400 text-xs">{entry.time}</span>
                <div className="text-white font-medium">
                  {typeof entry.value === 'string' 
                    ? entry.value 
                    : entry.type === 'bloodSugar'
                      ? `${entry.value} mg/dL`
                      : entry.value.toLocaleString()}
                </div>
              </div>
              
              {activeTab === 'bloodPressure' && (
                <div className="bg-black/30 px-2 py-1 rounded text-xs text-gray-300">
                  {parseInt((entry.value as string).split('/')[0]) > 130 ? 'High' : 'Normal'}
                </div>
              )}
              
              {activeTab === 'bloodSugar' && typeof entry.value === 'number' && (
                <div className="bg-black/30 px-2 py-1 rounded text-xs text-gray-300">
                  {entry.value > 140 ? 'High' : entry.value < 80 ? 'Low' : 'Normal'}
                </div>
              )}
            </motion.div>
          ))}
      </div>
      
      {/* Add New Entry Form */}
      {showForm ? (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4"
          onSubmit={handleSubmit}
        >
          {activeTab === 'bloodPressure' && (
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Systolic</label>
                <Input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  placeholder="120"
                  className="bg-black/20 border-white/10 text-white"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Diastolic</label>
                <Input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  placeholder="80"
                  className="bg-black/20 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          )}
          
          {activeTab === 'bloodSugar' && (
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Blood Sugar (mg/dL)</label>
              <Input
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                placeholder="110"
                className="bg-black/20 border-white/10 text-white"
                required
              />
            </div>
          )}
          
          {activeTab === 'steps' && (
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Steps Count</label>
              <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="2500"
                className="bg-black/20 border-white/10 text-white"
                required
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-zepmeds-purple hover:bg-zepmeds-purple/80">
              Save
            </Button>
          </div>
        </motion.form>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 bg-zepmeds-purple hover:bg-zepmeds-purple/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log New Entry
        </Button>
      )}
    </div>
  );
};

export default HealthMetricsLogger;
