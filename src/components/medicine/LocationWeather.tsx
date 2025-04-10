
import { MapPin, Cloud } from "lucide-react";

interface LocationWeatherProps {
  location: string;
  temperature: string;
  weather: string;
}

const LocationWeather = ({ location, temperature, weather }: LocationWeatherProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <MapPin className="h-4 w-4 text-zepmeds-purple mr-1" />
        <span className="text-sm text-white mr-2">{location}</span>
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
