
import { useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

// Generate time slots from 8 AM to 8 PM (12 hours)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const hourString = hour > 12 ? `${hour - 12}` : `${hour}`;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    slots.push(`${hourString}:00 ${amPm}`);
    if (hour < 20) { // Don't add 8:30 PM
      slots.push(`${hourString}:30 ${amPm}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const DateTimePicker = ({ 
  selectedDate, 
  onDateChange, 
  selectedTime, 
  onTimeChange 
}: DateTimePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Calculate the date range for the next 5 days
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Select Delivery Date</label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-black/40 border-gray-700 hover:bg-gray-900/50",
                !selectedDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-700 text-white" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsCalendarOpen(false);
              }}
              disabled={(date) => 
                date < today || date > fiveDaysLater || 
                date.getDay() === 0 // Disable Sundays
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Select Delivery Time</label>
        <Select
          value={selectedTime}
          onValueChange={onTimeChange}
          disabled={!selectedDate}
        >
          <SelectTrigger className="w-full bg-black/40 border-gray-700 text-white">
            <SelectValue placeholder="Select time slot">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-purple-400" />
                {selectedTime || "Select time"}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border border-gray-700 text-white">
            {timeSlots.map((slot) => (
              <SelectItem 
                key={slot} 
                value={slot}
                className="hover:bg-gray-800 focus:bg-gray-800"
              >
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedDate && selectedTime && (
        <div className="p-3 mt-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-sm">
          Your order will be delivered on {format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
