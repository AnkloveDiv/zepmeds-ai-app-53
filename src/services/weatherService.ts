
import { handleApiError } from "../utils/errorUtils";
import { mapWeatherCondition } from "../utils/weatherUtils";

const WEATHER_API_KEY = "3e3d18e16be5e1dc03dd9410b02e50c4";

export interface WeatherData {
  condition: 'sunny' | 'rainy' | 'cloudy';
  temperature: string;
  description: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
}

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.main || !data.weather || data.weather.length === 0) {
      throw new Error("Invalid weather data format");
    }
    
    const weatherId = data.weather[0].id;
    const condition = mapWeatherCondition(weatherId);
    
    return {
      condition,
      temperature: `${Math.round(data.main.temp)}°`,
      description: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed
    };
  } catch (error) {
    handleApiError(error, "Could not fetch weather data");
    // Return default weather data
    return {
      condition: 'cloudy',
      temperature: '29°',
      description: 'Cloudy'
    };
  }
};

export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.main || !data.weather || data.weather.length === 0) {
      throw new Error("Invalid weather data format");
    }
    
    const weatherId = data.weather[0].id;
    const condition = mapWeatherCondition(weatherId);
    
    return {
      condition,
      temperature: `${Math.round(data.main.temp)}°`,
      description: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed
    };
  } catch (error) {
    handleApiError(error, "Could not fetch weather data for this city");
    // Return default weather data
    return {
      condition: 'cloudy',
      temperature: '29°',
      description: 'Cloudy'
    };
  }
};
