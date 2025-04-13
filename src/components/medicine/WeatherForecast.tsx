
import React, { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Sun, Cloud, CloudDrizzle, CloudLightning, CloudSnow } from 'lucide-react';

interface WeatherForecastProps {
  temperature?: string;
  weather?: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  temperature = "29°",
  weather = "Clear" 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getWeatherIcon = () => {
    const weatherType = weather?.toLowerCase() || "";

    if (weatherType.includes('clear')) {
      return <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />;
    } else if (weatherType.includes('cloud')) {
      return <Cloud className="w-5 h-5 text-gray-400 animate-pulse" />;
    } else if (weatherType.includes('rain')) {
      return <CloudRain className="w-5 h-5 text-blue-400 animate-pulse" />;
    } else if (weatherType.includes('drizzle')) {
      return <CloudDrizzle className="w-5 h-5 text-blue-300 animate-pulse" />;
    } else if (weatherType.includes('thunder')) {
      return <CloudLightning className="w-5 h-5 text-purple-400 animate-pulse" />;
    } else if (weatherType.includes('snow')) {
      return <CloudSnow className="w-5 h-5 text-sky-200 animate-pulse" />;
    } else {
      return <CloudSun className="w-5 h-5 text-yellow-300 animate-pulse" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-16 h-8 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-opacity-40 backdrop-blur-sm">
      {getWeatherIcon()}
      <span className="text-sm font-semibold text-white">{temperature}</span>
    </div>
  );
};

export default WeatherForecast;
