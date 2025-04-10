
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  availableTimes: string[];
}

const AppointmentModal = ({
  open,
  onOpenChange,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  onConfirm,
  availableTimes
}: AppointmentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Book an Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Select a Date</h4>
            <div className="rounded-lg overflow-hidden bg-black/20 p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                className="rounded-md"
                disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Select a Time</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`${
                    selectedTime === time 
                      ? "bg-zepmeds-purple hover:bg-zepmeds-purple-light" 
                      : "border-gray-700 text-gray-400"
                  }`}
                  onClick={() => onTimeChange(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple-light"
            onClick={onConfirm}
          >
            Confirm Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
