
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthMetric {
  date: Date;
  type: string;
  value: number;
  unit: string;
}

const HealthMetricsLogger = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [newMetricType, setNewMetricType] = useState<string>('');
  const [newMetricValue, setNewMetricValue] = useState<string>('');
  const [newMetricUnit, setNewMetricUnit] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Load metrics from local storage on component mount
    const storedMetrics = localStorage.getItem('healthMetrics');
    if (storedMetrics) {
      setMetrics(JSON.parse(storedMetrics).map((metric: any) => ({ ...metric, date: new Date(metric.date) })));
    }
  }, []);

  useEffect(() => {
    // Save metrics to local storage whenever metrics change
    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
  }, [metrics]);

  const addMetric = () => {
    if (!newMetricValue || !newMetricUnit || !newMetricType) return;
    
    const newMetric = {
      date: date || new Date(),
      type: newMetricType,
      value: Number(newMetricValue),
      unit: newMetricUnit
    };
    
    setMetrics(prevMetrics => [...prevMetrics, newMetric]);
    setNewMetricValue('');
  };

  const deleteMetric = (index: number) => {
    setMetrics(prevMetrics => {
      const newMetrics = [...prevMetrics];
      newMetrics.splice(index, 1);
      return newMetrics;
    });
  };

  return (
    <Card className="w-full max-w-[500px] bg-background shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Health Metrics Logger</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="metric-type">Metric Type</Label>
              <Select onValueChange={setNewMetricType}>
                <SelectTrigger id="metric-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weight">Weight</SelectItem>
                  <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
                  <SelectItem value="Heart Rate">Heart Rate</SelectItem>
                  <SelectItem value="Sleep Duration">Sleep Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="metric-value">Value</Label>
              <Input
                type="number"
                id="metric-value"
                placeholder="Enter value"
                value={newMetricValue}
                onChange={(e) => setNewMetricValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="metric-unit">Unit</Label>
              <Select onValueChange={setNewMetricUnit}>
                <SelectTrigger id="metric-unit">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="mmHg">mmHg</SelectItem>
                  <SelectItem value="bpm">bpm</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full max-w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date?.toLocaleDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={addMetric} className="bg-zepmeds-purple hover:bg-zepmeds-purple/80">Add Metric</Button>
        </div>
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Logged Metrics</h3>
          {metrics.length === 0 ? (
            <p className="text-sm text-gray-500">No metrics logged yet.</p>
          ) : (
            <ul className="space-y-2">
              {metrics.map((metric, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                  <div>
                    <p className="text-sm font-medium">{metric.type}: {metric.value} {metric.unit}</p>
                    <p className="text-xs text-gray-500">
                      {metric.date.toLocaleDateString()} {metric.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => deleteMetric(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsLogger;
