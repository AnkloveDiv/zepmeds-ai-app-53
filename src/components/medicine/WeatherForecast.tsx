
import React, { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Sun, Cloud, CloudDrizzle, CloudLightning, CloudSnow } from 'lucide-react';

interface WeatherData {
  main: string;
  description: string;
  temp: number;
}

const WeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, replace with actual API call
    // For demo, we'll use mock data
    const mockWeatherData = {
      main: 'Clear',
      description: 'clear sky',
      temp: 28.5
    };
    
    // Simulate API call delay
    const timeout = setTimeout(() => {
      setWeather(mockWeatherData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-16 h-8 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  const getWeatherIcon = () => {
    if (!weather) return null;

    switch (weather.main.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'clouds':
        return <Cloud className="w-5 h-5 text-gray-400 animate-pulse" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'drizzle':
        return <CloudDrizzle className="w-5 h-5 text-blue-300 animate-pulse" />;
      case 'thunderstorm':
        return <CloudLightning className="w-5 h-5 text-purple-400 animate-pulse" />;
      case 'snow':
        return <CloudSnow className="w-5 h-5 text-sky-200 animate-pulse" />;
      default:
        return <CloudSun className="w-5 h-5 text-yellow-300 animate-pulse" />;
    }
  };

  return (
    <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-opacity-40 backdrop-blur-sm">
      {getWeatherIcon()}
      <span className="text-xs font-semibold text-white">
        {weather?.temp && `${Math.round(weather.temp)}°`}
      </span>
    </div>
  );
};

export default WeatherForecast;
