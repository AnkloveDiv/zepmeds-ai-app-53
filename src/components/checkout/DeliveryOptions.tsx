
import React from "react";
import { Truck, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import DateTimePicker from "./DateTimePicker";

interface DeliveryOptionsProps {
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
}

const DeliveryOptions = ({
  deliveryTime,
  setDeliveryTime,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
}: DeliveryOptionsProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <Truck className="mr-2 text-green-400" size={20} />
        Delivery Time
      </h2>
      
      <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime} className="space-y-3">
        <div className={`p-4 rounded-xl transition-all ${
          deliveryTime === "express" 
            ? "border-green-500 bg-green-900/30" 
            : "border-gray-700 bg-black/40"
        }`}>
          <div className="flex items-start">
            <RadioGroupItem value="express" id="express" className="text-green-400 mt-1 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label htmlFor="express" className="text-white font-medium">Express Delivery</Label>
                <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900/50 border-0">₹50</Badge>
              </div>
              <p className="text-green-400 text-sm font-medium">Delivered within 15 minutes</p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl transition-all ${
          deliveryTime === "standard" 
            ? "border-orange-500 bg-orange-900/30" 
            : "border-gray-700 bg-black/40"
        }`}>
          <div className="flex items-start">
            <RadioGroupItem value="standard" id="standard" className="text-orange-400 mt-1 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label htmlFor="standard" className="text-white font-medium">Standard Delivery</Label>
                <Badge className="bg-blue-900/50 text-blue-400 hover:bg-blue-900/50 border-0">FREE</Badge>
              </div>
              <p className="text-gray-400 text-sm">Delivered within 2 hours</p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl transition-all ${
          deliveryTime === "scheduled" 
            ? "border-purple-500 bg-purple-900/30" 
            : "border-gray-700 bg-black/40"
        }`}>
          <div className="flex items-start">
            <RadioGroupItem value="scheduled" id="scheduled" className="text-purple-400 mt-1 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label htmlFor="scheduled" className="text-white font-medium">Scheduled Delivery</Label>
                <Badge className="bg-blue-900/50 text-blue-400 hover:bg-blue-900/50 border-0">FREE</Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1 text-purple-400" />
                <span>Choose your preferred delivery slot</span>
              </div>
            </div>
          </div>
          
          {deliveryTime === "scheduled" && (
            <div className="mt-4 ml-8">
              <DateTimePicker
                selectedDate={scheduledDate}
                onDateChange={setScheduledDate}
                selectedTime={scheduledTime}
                onTimeChange={setScheduledTime}
              />
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default DeliveryOptions;
