
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface HealthMetricsLoggerProps {
  onSubmit: (data: {
    date: Date;
    type: string;
    value: number;
    unit: string;
  }) => void;
}

// Form schema
const formSchema = z.object({
  date: z.date(),
  type: z.string().min(1, { message: 'Please select a metric type' }),
  value: z.coerce.number().min(0, { message: 'Value cannot be negative' }),
  unit: z.string().min(1, { message: 'Please select a unit' }),
});

export const HealthMetricsLogger: React.FC<HealthMetricsLoggerProps> = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState<string>('');

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: '',
      value: 0,
      unit: '',
    },
  });

  // Get units based on selected type
  const getUnitsForType = (type: string): { value: string; label: string }[] => {
    switch (type) {
      case 'Blood Pressure':
        return [{ value: 'mmHg', label: 'mmHg' }];
      case 'Heart Rate':
        return [{ value: 'bpm', label: 'bpm' }];
      case 'Blood Glucose':
        return [{ value: 'mg/dL', label: 'mg/dL' }, { value: 'mmol/L', label: 'mmol/L' }];
      case 'Temperature':
        return [{ value: '°F', label: '°F' }, { value: '°C', label: '°C' }];
      case 'Weight':
        return [{ value: 'lbs', label: 'lbs' }, { value: 'kg', label: 'kg' }];
      default:
        return [];
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue('type', value);
    
    // Set default unit for the selected type
    const units = getUnitsForType(value);
    if (units.length > 0) {
      form.setValue('unit', units[0].value);
    } else {
      form.setValue('unit', '');
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metric Type</FormLabel>
              <Select onValueChange={handleTypeChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a metric" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
                  <SelectItem value="Heart Rate">Heart Rate</SelectItem>
                  <SelectItem value="Blood Glucose">Blood Glucose</SelectItem>
                  <SelectItem value="Temperature">Temperature</SelectItem>
                  <SelectItem value="Weight">Weight</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getUnitsForType(selectedType).map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80">
          Log Health Data
        </Button>
      </form>
    </Form>
  );
};
