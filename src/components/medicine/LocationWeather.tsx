
import { useState } from "react";
import { MapPin, Cloud, Check, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationWeatherProps {
  location: string;
  temperature: string;
  weather: string;
  onLocationSave?: (location: string) => void;
}

const LocationWeather = ({ location, temperature, weather, onLocationSave }: LocationWeatherProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [locationInput, setLocationInput] = useState(location);
  
  const handleSave = () => {
    if (locationInput.trim() && onLocationSave) {
      onLocationSave(locationInput);
    }
    setIsEditing(false);
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
        {isEditing ? (
          <div className="flex items-center">
            <Input 
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="h-7 bg-black/20 border-white/10 text-white w-32 mr-1 text-sm"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={handleSave}
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-white mr-2">{location}</span>
            <button onClick={() => setIsEditing(true)} className="text-zepmeds-purple">
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center text-sm text-white">
        <Cloud className="h-4 w-4 text-blue-400 mr-1" />
        <span>{temperature}</span>
        <span className="ml-1 text-gray-400">({weather})</span>
      </div>
    </div>
  );
};

export default LocationWeather;
